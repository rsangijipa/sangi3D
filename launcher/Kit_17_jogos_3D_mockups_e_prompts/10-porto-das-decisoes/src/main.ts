/**
 * Porto das Decisões — Ponto de Entrada Principal
 * Inicialização e ligação entre FSM, Cena 3D, Áudio, HUD e Controlador de Entrada
 */

import { createInitialState, gameReducer, GameState, GameAction } from './game/state';
import { getMissionById, BOATS_CATALOG, getNodeById } from './game/content';
import { simulateVoyage, isEdgeConnected, getAdjacentNodes } from './game/rules';
import { GameScene } from './scene/gameScene';
import { SoundEngine } from './audio/soundEngine';
import { GameHUD } from './ui/hud';
import { InputController } from './input/controller';
import './style.css';

class PortoDasDecisoesApp {
  private state: GameState;
  private scene: GameScene;
  private audio: SoundEngine;
  private hud: GameHUD;
  private input: InputController;
  private tickIntervalId: number = 0;

  constructor() {
    // 1. Estado inicial
    this.state = createInitialState('m1');
    this.setupMissionCargo('m1');

    // 2. Elementos DOM
    const appEl = document.getElementById('app') || document.body;
    let canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) {
      canvasContainer = document.createElement('div');
      canvasContainer.id = 'canvas-container';
      appEl.appendChild(canvasContainer);
    }

    let hudContainer = document.getElementById('hud-container');
    if (!hudContainer) {
      hudContainer = document.createElement('div');
      hudContainer.id = 'hud-container';
      appEl.appendChild(hudContainer);
    }

    // 3. Motor de Áudio
    this.audio = new SoundEngine();

    // 4. Cena Three.js
    this.scene = new GameScene(canvasContainer, {
      onNodeClicked: (nodeId) => this.handleNodeClick(nodeId),
      onWaypointReached: (nodeId, index) => this.handleWaypointReached(nodeId, index),
      onVoyageFinished: () => this.handleVoyageFinished()
    });

    // 5. Interface HUD
    this.hud = new GameHUD(hudContainer, {
      onDispatch: (action) => this.dispatch(action),
      onSimulateClicked: () => this.handleSimulate(),
      onConfirmVoyageClicked: () => this.handleConfirmVoyage(),
      onSkipSimulation: () => this.handleSkipSimulation(),
      onEditCargoClicked: () => this.dispatch({ type: 'SET_MODAL', payload: 'cargo' }),
      onUndoClicked: () => this.handleUndo(),
      onClearRouteClicked: () => this.handleClearRoute(),
      onToggleAudio: () => this.handleToggleAudio(),
      onAddNode: (nodeId) => this.handleNodeClick(nodeId),
      onApplyAlternativeRoute: (route) => this.handleApplyAlternativeRoute(route)
    });

    // 6. Controlador de Entrada (Teclado)
    this.input = new InputController({
      dispatch: (action) => this.dispatch(action),
      onSimulate: () => this.handleSimulate(),
      onConfirmVoyage: () => this.handleConfirmVoyage(),
      onUndo: () => this.handleUndo(),
      onToggleAudio: () => this.handleToggleAudio(),
      onNextNode: () => this.handleNextAdjacentNode(),
      getState: () => this.state
    });

    // 7. Intervalo de contagem de tempo ativo
    this.tickIntervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.dispatch({ type: 'TICK_TIME', payload: 1 });
      }
    }, 1000);

    // Sincronização inicial
    this.scene.syncWithState(this.state);
    this.hud.render(this.state);
  }

  private setupMissionCargo(missionId: string): void {
    const mission = getMissionById(missionId);
    // Configura o barco inicial da missão
    this.state.selectedBoatId = mission.initialBoatId;
    const boat = BOATS_CATALOG[mission.initialBoatId];

    // Carregar no barco 3 caixas (para m1) ou até a meta/capacidade
    const initialLoadCount = Math.min(boat.capacity, mission.id === 'm1' ? 3 : mission.targetBoxes);
    const initialCargo = mission.cargoSet.slice(0, initialLoadCount);
    const availableCargo = mission.cargoSet.slice(initialCargo.length);

    this.state.cargoOnboard = [...initialCargo];
    this.state.availableCargo = [...availableCargo];

    // Para a missão inicial, apresenta a primeira conexão traçada exatamente como no mockup
    if (missionId === 'm1') {
      this.state.route = ['node_harbor', 'node_channel_1'];
      this.state.undoStack = [['node_harbor']];
    }
  }

  public dispatch(action: GameAction): void {
    this.state = gameReducer(this.state, action);

    // Efeitos colaterais específicos de ações
    if (action.type === 'SET_MISSION') {
      this.setupMissionCargo(action.payload);
      this.audio.playHarborBell();
    } else if (action.type === 'LOAD_CARGO') {
      this.audio.playCraneWinch();
      this.scene.crane.triggerLoadAnimation();
      setTimeout(() => this.audio.playCrateThud(), 350);
    } else if (action.type === 'UNLOAD_CARGO') {
      this.audio.playCraneWinch();
      setTimeout(() => this.audio.playCrateThud(), 200);
      this.scene.crane.rotateTo(-1.0 + Math.random() * 0.3);
    } else if (action.type === 'SELECT_BOAT') {
      this.audio.playClick();
      (['blue', 'green', 'red'] as const).forEach(id => {
        if (id !== action.payload) {
          this.scene.boats.resetBoatToAnchor(id);
        }
      });
    }

    // Sincronizar cena e renderizar HUD
    this.scene.syncWithState(this.state);
    this.hud.render(this.state);
  }

  private handleNodeClick(nodeId: string): void {
    if (this.state.isSimulating || this.state.isVoyaging) return;

    const currentLast = this.state.route[this.state.route.length - 1];
    if (currentLast === nodeId) {
      // Já é o último nó selecionado
      return;
    }

    // Verificar se é conectado ao nó anterior
    if (isEdgeConnected(currentLast, nodeId)) {
      this.audio.playNodeSelect();
      this.dispatch({ type: 'ADD_NODE_TO_ROUTE', payload: nodeId });
    } else {
      const fromName = getNodeById(currentLast)?.name || currentLast;
      const toName = getNodeById(nodeId)?.name || nodeId;
      this.dispatch({
        type: 'SET_FEEDBACK',
        payload: {
          type: 'warning',
          text: `Não há canal navegável direto entre ${fromName} e ${toName}. Conecte os nós adjacentes!`
        }
      });
      this.audio.playClick();
    }
  }

  private handleSimulate(): void {
    this.audio.ensureContext();
    const mission = getMissionById(this.state.missionId);
    const boat = BOATS_CATALOG[this.state.selectedBoatId];

    const sim = simulateVoyage(
      this.state.route,
      this.state.cargoOnboard,
      boat,
      mission
    );

    this.dispatch({ type: 'START_SIMULATION', payload: sim });

    if (sim.canExecute) {
      this.audio.playBoatHorn();
    } else {
      this.audio.playClick();
    }
  }

  private handleConfirmVoyage(): void {
    if (!this.state.simResult || !this.state.simResult.canExecute) return;
    this.audio.playBoatHorn();
    this.dispatch({ type: 'CONFIRM_VOYAGE' });
  }

  private handleSkipSimulation(): void {
    if (!this.state.isSimulating) return;
    this.scene.stopBoatTravel();
    this.dispatch({ type: 'END_SIMULATION' });
    this.audio.playHarborBell();
  }

  private handleApplyAlternativeRoute(route: string[]): void {
    this.audio.playNodeSelect();
    this.dispatch({ type: 'APPLY_ALTERNATIVE_ROUTE', payload: route });
  }

  private handleNextAdjacentNode(): void {
    if (this.state.isSimulating || this.state.isVoyaging) return;
    const currentLast = this.state.route[this.state.route.length - 1];
    const neighbors = getAdjacentNodes(currentLast);
    const prevNode = this.state.route.length >= 2 ? this.state.route[this.state.route.length - 2] : null;
    const candidate = neighbors.find(n => n !== prevNode) || neighbors[0];
    if (candidate) {
      this.handleNodeClick(candidate);
    }
  }

  private handleWaypointReached(nodeId: string, _index: number): void {
    this.audio.playHarborBell();
    if (this.state.isVoyaging) {
      const hasCargoForThisNode = this.state.cargoOnboard.some(c => c.destinationNodeId === nodeId);
      if (hasCargoForThisNode) {
        this.dispatch({ type: 'DELIVER_CARGO_AT_NODE', payload: { nodeId } });
        this.audio.playCrateThud();
        const nodeName = getNodeById(nodeId)?.name || nodeId;
        this.dispatch({
          type: 'SET_FEEDBACK',
          payload: {
            type: 'success',
            text: `Chegada ao ${nodeName}: encomenda descarregada no cais!`
          }
        });
      }
    }
  }

  private handleVoyageFinished(): void {
    if (this.state.isSimulating) {
      // Simulação concluída
      this.dispatch({ type: 'END_SIMULATION' });
      this.audio.playHarborBell();
    } else if (this.state.isVoyaging) {
      // Viagem confirmada concluída: descarregar caixas dos destinos visitados
      const sim = this.state.simResult;
      const allDelivered = sim ? sim.deliveries.flatMap(d => d.unloadedCargo) : [];
      this.dispatch({ type: 'COMPLETE_VOYAGE', payload: { delivered: allDelivered } });
      this.audio.playBoatHorn();
    }
  }

  private handleUndo(): void {
    this.audio.playUndo();
    this.dispatch({ type: 'UNDO_LAST_NODE' });
  }

  private handleClearRoute(): void {
    this.audio.playClick();
    this.dispatch({ type: 'CLEAR_ROUTE' });
  }

  private handleToggleAudio(): void {
    this.audio.toggleMute();
    this.dispatch({ type: 'TOGGLE_AUDIO' });
  }

  public destroy(): void {
    clearInterval(this.tickIntervalId);
    this.input.dispose();
    this.scene.dispose();
    this.audio.dispose();
  }
}

// Inicializar aplicação ao carregar DOM
window.addEventListener('DOMContentLoaded', () => {
  const app = new PortoDasDecisoesApp();
  const handleDispose = () => app.destroy();
  window.addEventListener('sangi:dispose', handleDispose);
  window.addEventListener('beforeunload', handleDispose);
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'SANGI_APP_DISPOSE' || (e.data?.type === 'SANGI_COMMAND' && String(e.data?.command).toUpperCase() === 'DISPOSE')) {
      handleDispose();
    }
  });
});
