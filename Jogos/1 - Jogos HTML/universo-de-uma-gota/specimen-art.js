import {randomGenerator} from './simulation.js';

const tau = Math.PI * 2;

function path(ctx, points) {
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
}

function ellipse(ctx, x, y, rx, ry, angle = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, angle, 0, tau);
}

function gradient(ctx, stops, x, y, radius, centerX = x, centerY = y) {
  const result = ctx.createRadialGradient(centerX, centerY, 0, x, y, radius);
  for (const [stop, color] of stops) result.addColorStop(stop, color);
  return result;
}

function grains(ctx, random, count, box, colors, maxSize = 2.1) {
  const [x, y, width, height] = box;
  for (let i = 0; i < count; i++) {
    const px = x + width * random();
    const py = y + height * random();
    const r = 0.28 + maxSize * random() ** 3;
    ctx.fillStyle = colors[i % colors.length];
    ellipse(ctx, px, py, r, r * (0.55 + random() * 0.5));
    ctx.fill();
  }
}

function vesicle(ctx, x, y, r, ry, hue, angle) {
  const a = [`hsla(${hue},68%,8%,.88)`, `hsla(${hue},65%,36%,.52)`, `hsla(${hue},85%,77%,.69)`];
  ellipse(ctx, x, y, r, ry, angle);
  ctx.fillStyle = gradient(ctx, [[0, a[0]], [0.48, a[0]], [0.79, a[1]], [1, a[2]]], x, y, r, x - r * 0.12, y + r * 0.09);
  ctx.fill();
  ctx.strokeStyle = `hsla(${hue},85%,82%,.57)`;
  ctx.lineWidth = 0.85;
  ctx.stroke();
  ellipse(ctx, x - r * 0.24, y - ry * 0.35, Math.max(0.45, r * 0.14), Math.max(0.4, ry * 0.12), angle);
  ctx.fillStyle = `hsla(${hue},85%,91%,.68)`;
  ctx.fill();
}

function membrane(ctx, points, color, glow, width) {
  path(ctx, points);
  ctx.lineWidth = width * 4;
  ctx.strokeStyle = glow;
  ctx.stroke();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function ciliate(ctx, random) {
  const points = Array.from({length: 248}, (_, i) => {
    const t = i / 248 * tau;
    const x = Math.cos(t);
    const roughness = Math.sin(t * 19) * 1.1 + Math.sin(t * 43) * 0.5;
    return [312 + x * 231, 194 + Math.sin(t) * (76 + x * 16 + roughness) + 20 * (x ** 2 - 0.5) - 12 * x];
  });
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    const [px, py] = points[(i + points.length - 1) % points.length];
    const [nx, ny] = points[(i + 1) % points.length];
    const length = Math.hypot(nx - px, ny - py);
    const offset = 8 + random() * 17;
    const ox = (ny - py) / length * offset;
    const oy = (px - nx) / length * offset;
    ctx.beginPath();
    ctx.moveTo(x - ox * 0.23, y - oy * 0.23);
    ctx.quadraticCurveTo(x + ox * 0.73 + 6, y + oy * 0.72, x + ox - 7, y + oy);
    ctx.strokeStyle = `rgba(${y < 190 ? '190,245,255' : '129,197,184'},${0.33 + random() * 0.58})`;
    ctx.lineWidth = 0.5 + random() * 0.88;
    ctx.stroke();
  }

  ctx.save();
  path(ctx, points);
  ctx.clip();
  ctx.fillStyle = gradient(ctx, [[0, '#326265'], [0.46, '#1e4852'], [0.73, '#123039'], [0.92, '#315866'], [1, '#7cacae']], 306, 194, 254, 344, 181);
  ctx.fillRect(70, 90, 490, 210);
  for (let i = 0; i < 31; i++) {
    const x = 90 + random() * 450;
    const y = 111 + random() * 158;
    const r = 11 + random() * 62;
    ctx.fillStyle = gradient(ctx, [[0, i % 4 === 0 ? '#c08a5159' : '#78dccb2e'], [1, '#32668300']], x, y, r);
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  grains(ctx, random, 4300, [77, 102, 476, 184], ['#c7ecc66d', '#ffe6a381', '#062129a0', '#91e1db82', '#8ccb7290'], 2.8);
  for (let i = 0; i < 144; i++) {
    const x = 85 + random() * 452;
    const y = 104 + random() * 185;
    const r = 2.1 + random() ** 2 * 5.8;
    vesicle(ctx, x, y, r, r * (0.53 + random() * 0.46), i % 3 === 0 ? 38 : 171, random() * tau);
  }
  for (const [x, y, r] of [[158, 173, 26], [424, 181, 20], [476, 157, 15], [193, 207, 13], [373, 212, 15]]) {
    vesicle(ctx, x, y, r, r * 0.87, 161, 0.17);
    ctx.save();
    ellipse(ctx, x, y, r * 0.83, r * 0.77);
    ctx.clip();
    grains(ctx, random, 78, [x - r, y - r, r * 2, r * 2], ['#a9f3da85', '#ffffd795', '#639c6fb1'], 1.3);
    ctx.restore();
  }
  ellipse(ctx, 293, 190, 53, 24, -0.36);
  ctx.fillStyle = gradient(ctx, [[0, '#8bae8c'], [0.54, '#3d715b'], [0.79, '#21473c'], [1, '#b8bf81']], 293, 190, 54, 288, 191);
  ctx.fill();
  ctx.save();
  ctx.clip();
  grains(ctx, random, 385, [240, 154, 108, 67], ['#d0e7a780', '#10272ba7', '#db995591', '#88c3b5a0'], 2.2);
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(241, 246);
  ctx.bezierCurveTo(277, 225, 335, 236, 401, 206);
  ctx.bezierCurveTo(342, 253, 290, 255, 241, 246);
  ctx.fillStyle = '#061f2bd9';
  ctx.fill();
  ctx.strokeStyle = '#d4fcda97';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  for (let offset = -0.77; offset <= 0.77; offset += 0.19) {
    ctx.beginPath();
    ctx.moveTo(88, 193);
    ctx.bezierCurveTo(174, 198 + offset * 99, 437, 185 + offset * 115, 530, 173);
    ctx.strokeStyle = '#b6f6de21';
    ctx.lineWidth = 0.95;
    ctx.stroke();
  }
  ctx.restore();
  membrane(ctx, points, '#a4e7e2d4', '#70c5e046', 1.86);
  ctx.beginPath();
  points.slice(133, 236).forEach(([x, y], i) => i ? ctx.lineTo(x, y + 3) : ctx.moveTo(x, y + 3));
  ctx.strokeStyle = '#e4ffef8b';
  ctx.lineWidth = 2.3;
  ctx.stroke();
}

function diatom(ctx, random) {
  const points = Array.from({length: 166}, (_, i) => {
    const t = i / 166 * tau;
    const x = Math.cos(t);
    return [320 + 252 * x, 192 + 77 * Math.sin(t) * (0.76 + 0.24 * Math.abs(Math.sin(t)))];
  });
  ctx.save();
  path(ctx, points);
  ctx.clip();
  const base = ctx.createLinearGradient(0, 111, 0, 273);
  base.addColorStop(0, '#e7ad63');
  base.addColorStop(0.11, '#a67339');
  base.addColorStop(0.3, '#684027');
  base.addColorStop(0.50, '#3f2f1c');
  base.addColorStop(0.70, '#815a2a');
  base.addColorStop(0.88, '#9c703f');
  base.addColorStop(1, '#ffe79d');
  ctx.fillStyle = base;
  ctx.fillRect(67, 112, 510, 160);
  for (const [x, y, r] of [[222, 167, 74], [275, 218, 62], [415, 155, 69], [407, 223, 58]]) {
    ctx.fillStyle = gradient(ctx, [[0, '#eaa84093'], [0.49, '#b57b3e87'], [1, '#64392d00']], x, y, r);
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  grains(ctx, random, 2200, [68, 113, 500, 158], ['#f1cb8679', '#39191a99', '#e99b536b', '#fffbd285'], 2.4);
  ctx.lineWidth = 1.18;
  for (let i = 0; i < 83; i++) {
    const x = 65 + i * 6.2;
    const bow = 20 * ((x - 320) / 250);
    ctx.beginPath();
    ctx.moveTo(x + bow, 103);
    ctx.quadraticCurveTo(x - bow, 172, x - bow * 0.35, 188);
    ctx.moveTo(x - bow * 0.35, 197);
    ctx.quadraticCurveTo(x - bow, 217, x + bow, 283);
    ctx.strokeStyle = i % 3 === 0 ? '#fff9cfbd' : '#f9d08379';
    ctx.stroke();
    for (let y = 107; y < 282; y += 6.8) {
      ctx.fillStyle = y % 3 < 1 ? '#fff9dfba' : '#241a17b0';
      ellipse(ctx, x + 2 + bow * (Math.abs(y - 193) / 85 - 0.4), y, 0.96, 1.12);
      ctx.fill();
    }
  }
  ctx.beginPath();
  ctx.moveTo(70, 192);
  ctx.bezierCurveTo(179, 182, 457, 200, 569, 190);
  ctx.strokeStyle = '#402718';
  ctx.lineWidth = 9.5;
  ctx.stroke();
  ctx.strokeStyle = '#ffc573bd';
  ctx.lineWidth = 2.8;
  ctx.stroke();
  vesicle(ctx, 320, 190, 11, 8, 44, 0);
  ctx.restore();
  membrane(ctx, points, '#fff0b6ec', '#fbbf6382', 2.5);
}

function filament(ctx, random) {
  const center = (x) => 195 + Math.sin((x - 38) / 88) * 61 + Math.sin((x - 20) / 38) * 13;
  const x0 = 24;
  const x1 = 616;
  const top = [];
  const bottom = [];
  for (let x = x0; x <= x1; x += 2) {
    top.push([x, center(x) - 19 - Math.sin(x / 19) * 2.1]);
    bottom.unshift([x, center(x) + 19 + Math.sin(x / 21) * 2]);
  }
  const points = [...top, ...bottom];
  ctx.save();
  path(ctx, points);
  ctx.clip();
  ctx.fillStyle = '#244e2fc6';
  ctx.fillRect(20, 82, 610, 230);
  for (let offset = -13; offset <= 13; offset += 13) {
    ctx.beginPath();
    for (let x = x0; x <= x1; x += 2) {
      const y = center(x) + offset;
      if (x === x0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = offset ? '#b9ed7b4a' : '#182725a0';
    ctx.lineWidth = offset ? 7.5 : 11;
    ctx.stroke();
  }
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    for (let x = x0; x <= x1; x += 2) {
      const y = center(x) + Math.sin(x / (7.7 + i * 0.27) + i * 1.61) * (13 - i * 0.21);
      if (x === x0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = ['#274523', '#3b7f2c', '#74bf42', '#b8dc61'][i];
    ctx.lineWidth = 8 - i * 1.48;
    ctx.stroke();
  }
  for (let x = 49; x < x1; x += 42) {
    ctx.beginPath();
    ctx.moveTo(x - 4, center(x - 4) - 22);
    ctx.quadraticCurveTo(x + 8, center(x), x + 4, center(x + 4) + 22);
    ctx.strokeStyle = '#ddffafa8';
    ctx.lineWidth = 1.25;
    ctx.stroke();
  }
  grains(ctx, random, 3350, [21, 101, 597, 204], ['#dcff8695', '#214529bd', '#75ab418d', '#ebd9766e'], 1.7);
  ctx.restore();
  membrane(ctx, points, '#c4e889ab', '#9ec9533a', 1.56);
}

function amoeba(ctx, random) {
  const points = Array.from({length: 226}, (_, i) => {
    const t = i / 226 * tau;
    const lobe = 1 + 0.19 * Math.sin(5 * t + 0.65) + 0.15 * Math.cos(3 * t - 0.4) + 0.093 * Math.sin(9 * t) + Math.cos(t * 18) * 0.022;
    return [322 + Math.cos(t) * (205 * lobe), 193 + Math.sin(t) * (123 * lobe)];
  });
  ctx.save();
  path(ctx, points);
  ctx.clip();
  ctx.fillStyle = gradient(ctx, [[0, '#326c7c'], [0.42, '#245b79'], [0.68, '#164253'], [0.88, '#458796'], [1, '#79bdc7']], 322, 192, 288, 280, 178);
  ctx.fillRect(65, 16, 538, 348);
  for (let i = 0; i < 21; i++) {
    const x = 79 + random() * 478;
    const y = 60 + random() * 272;
    const r = 24 + random() * 55;
    ctx.fillStyle = gradient(ctx, [[0, i % 4 === 0 ? '#bf897c70' : '#509fb656'], [1, '#4d63ae00']], x, y, r);
    ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  grains(ctx, random, 3540, [66, 20, 522, 330], ['#8ae6ec79', '#66b2bb89', '#ffdaab72', '#10293888'], 3.1);
  for (let i = 0; i < 110; i++) {
    const x = 89 + random() * 464;
    const y = 42 + random() * 274;
    const r = 2.4 + random() ** 5 * 25;
    vesicle(ctx, x, y, r, r * 0.88, i % 3 ? 178 : 34, random() * tau);
  }
  vesicle(ctx, 305, 186, 52, 38, 203, -0.41);
  ctx.save();
  ellipse(ctx, 305, 186, 44, 31, -0.41);
  ctx.clip();
  grains(ctx, random, 266, [252, 146, 107, 80], ['#e0f2ffd1', '#9bb4d6a5', '#666189cb', '#1e4559bf'], 2.8);
  ctx.restore();
  ctx.restore();
  membrane(ctx, points, '#a5dfe5c7', '#478fb355', 1.8);
}

function colony(ctx, random) {
  const x = 320;
  const y = 192;
  const r = 157;
  ellipse(ctx, x, y, r, r);
  ctx.fillStyle = gradient(ctx, [[0, '#385f2ba3'], [0.39, '#194631ab'], [0.75, '#3b6937b6'], [0.92, '#5b963fad'], [0.97, '#80be5bc7'], [1, '#a9e582e4']], x, y, r, x - 20, y - 32);
  ctx.fill();
  for (const [dx, dy, rad] of [[-47, 38, 44], [39, -31, 55], [56, 56, 26], [-54, -58, 31]]) {
    vesicle(ctx, x + dx, y + dy, rad, rad, 98, 0);
    for (let i = 0; i < 130; i++) {
      const a = random() * tau;
      const d = Math.sqrt(random()) * rad * 0.92;
      ctx.fillStyle = i % 3 === 0 ? '#e7ffb1a9' : '#a9e85b91';
      ellipse(ctx, x + dx + Math.cos(a) * d, y + dy + Math.sin(a) * d, 1 + random() * 1.4, 1 + random() * 1.2);
      ctx.fill();
    }
  }
  for (let i = 0; i < 650; i++) {
    const a = i * 2.399963;
    const depth = (i + 0.5) / 650;
    const d = Math.sqrt(1 - depth * depth) * r * 0.983;
    const px = x + Math.cos(a) * d;
    const py = y + Math.sin(a) * d;
    const cell = 0.82 + random() ** 2 * 1.93;
    const opacity = (0.51 + random() * 0.42).toFixed(2);
    ellipse(ctx, px + 0.8, py + 0.9, cell * 1.42, cell * 1.25);
    ctx.fillStyle = '#172a20bf';
    ctx.fill();
    ellipse(ctx, px, py, cell, cell * 0.89, a);
    ctx.fillStyle = i % 4 === 0 ? `rgba(236,255,152,${opacity})` : `rgba(116,192,55,${opacity})`;
    ctx.fill();
  }
  ellipse(ctx, x, y, r, r);
  ctx.strokeStyle = '#b2e67758';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.strokeStyle = '#c4efafa0';
  ctx.lineWidth = 1.8;
  ctx.stroke();
}

export function createSpecimenArt() {
  return [ciliate, diatom, filament, amoeba, colony].map((draw, i) => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 384;
    draw(canvas.getContext('2d'), randomGenerator(17921 + i * 57719));
    return canvas;
  });
}
