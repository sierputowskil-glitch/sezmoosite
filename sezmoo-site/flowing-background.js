(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var CONFIG = {
    speed: 0.035,
    cursor: {
      follow: 0.09,
      fadeIn: 0.06,
      warpRadius: 0.22,
      warpStrength: 0.045,
      rippleStrength: 0.025,
      glowRadius: 0.13,
      glowStrength: 0.22,
      shadowStrength: 0.72
    }
  };

  var canvas = document.getElementById('flow-bg-canvas');
  if (!canvas) return;

  var gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) {
    canvas.style.display = 'none';
    return;
  }

  var VSRC = [
    'attribute vec2 p;',
    'void main(){ gl_Position = vec4(p, 0.0, 1.0); }'
  ].join('\n');

  var FSRC = [
    'precision highp float;',
    'uniform vec2 u_res;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',
    'uniform float u_mAmt;',
    'uniform float u_warpRadius, u_warpStrength, u_rippleStrength;',
    'uniform float u_glowRadius, u_glowStrength, u_shadowStrength;',
    'float hash(vec2 p){',
    '  p = fract(p * vec2(123.34, 456.21));',
    '  p += dot(p, p + 45.32);',
    '  return fract(p.x * p.y);',
    '}',
    'float noise(vec2 p){',
    '  vec2 i = floor(p); vec2 f = fract(p);',
    '  vec2 u = f*f*(3.0-2.0*f);',
    '  float a = hash(i);',
    '  float b = hash(i + vec2(1.0,0.0));',
    '  float c = hash(i + vec2(0.0,1.0));',
    '  float d = hash(i + vec2(1.0,1.0));',
    '  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);',
    '}',
    'float fbm(vec2 p){',
    '  float v = 0.0; float amp = 0.5;',
    '  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);',
    '  for(int i=0;i<6;i++){ v += amp * noise(p); p = m * p; amp *= 0.5; }',
    '  return v;',
    '}',
    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / u_res.xy;',
    '  float aspect = u_res.x / u_res.y;',
    '  vec2 st = uv; st.x *= aspect;',
    '  float t = u_time;',
    '  vec2 mst = u_mouse; mst.x *= aspect;',
    '  float mdUv = distance(uv, u_mouse);',
    '  float infl = smoothstep(u_warpRadius, 0.0, mdUv) * u_mAmt;',
    '  vec2 toM = st - mst;',
    '  float lenM = length(toM) + 1e-4;',
    '  vec2 dir = toM / lenM;',
    '  float ripple = sin(lenM * 22.0 - u_time * 68.6);',
    '  vec2 warp = dir * infl * (u_warpStrength + u_rippleStrength * ripple);',
    '  vec2 sw = st + warp;',
    '  vec2 q = vec2(fbm(sw * 1.4 + vec2(0.0, t)), fbm(sw * 1.4 + vec2(3.2, -t)));',
    '  vec2 r = vec2(fbm(sw * 1.4 + 2.0*q + vec2(1.7 + 0.15*t, 9.2)), fbm(sw * 1.4 + 2.0*q + vec2(8.3, 2.8 - 0.12*t)));',
    '  float f = fbm(sw * 1.4 + 3.5*r);',
    '  vec3 black = vec3(0.004);',
    '  vec3 charcoal = vec3(0.022);',
    '  vec3 fog = vec3(0.205);',
    '  vec3 smoke = vec3(0.082);',
    '  vec3 col = mix(black, charcoal, smoothstep(0.15, 0.75, f));',
    '  col = mix(col, smoke, smoothstep(0.5, 0.95, f) * 0.5 * r.y);',
    '  col = mix(col, fog, smoothstep(0.62, 0.98, f) * 0.28);',
    '  float core = smoothstep(u_glowRadius, 0.0, mdUv) * u_mAmt;',
    '  col = mix(col, fog, core * (u_glowStrength + 0.2 * smoothstep(0.2, 0.8, f)));',
    '  float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5)));',
    '  col *= mix(0.72, 1.0, vig);',
    '  float grain = (hash(gl_FragCoord.xy + fract(u_time*28.6)) - 0.5) * 0.055;',
    '  col += grain;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed');
    }
    return shader;
  }

  var prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VSRC));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FSRC));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    canvas.style.display = 'none';
    return;
  }
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var U = {};
  [
    'u_res',
    'u_time',
    'u_mouse',
    'u_mAmt',
    'u_warpRadius',
    'u_warpStrength',
    'u_rippleStrength',
    'u_glowRadius',
    'u_glowStrength',
    'u_shadowStrength'
  ].forEach(function (n) {
    U[n] = gl.getUniformLocation(prog, n);
  });

  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.floor(canvas.clientWidth * dpr);
    var h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  var mouse = { tx: 0.5, ty: 0.5, x: 0.5, y: 0.5, tAmt: 0, amt: 0 };

  function onMove(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.tx = (e.clientX - rect.left) / rect.width;
    mouse.ty = 1.0 - (e.clientY - rect.top) / rect.height;
    mouse.tAmt = 1;
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onMove, { passive: true });
  document.addEventListener('mouseleave', function () { mouse.tAmt = 0; });
  resize();

  var start = performance.now();

  function loop(now) {
    resize();
    mouse.x += (mouse.tx - mouse.x) * CONFIG.cursor.follow;
    mouse.y += (mouse.ty - mouse.y) * CONFIG.cursor.follow;
    mouse.amt += (mouse.tAmt - mouse.amt) * CONFIG.cursor.fadeIn;

    gl.uniform2f(U.u_res, canvas.width, canvas.height);
    gl.uniform1f(U.u_time, (now - start) / 1000 * CONFIG.speed);
    gl.uniform2f(U.u_mouse, mouse.x, mouse.y);
    gl.uniform1f(U.u_mAmt, mouse.amt);
    gl.uniform1f(U.u_warpRadius, CONFIG.cursor.warpRadius);
    gl.uniform1f(U.u_warpStrength, CONFIG.cursor.warpStrength);
    gl.uniform1f(U.u_rippleStrength, CONFIG.cursor.rippleStrength);
    gl.uniform1f(U.u_glowRadius, CONFIG.cursor.glowRadius);
    gl.uniform1f(U.u_glowStrength, CONFIG.cursor.glowStrength);
    gl.uniform1f(U.u_shadowStrength, CONFIG.cursor.shadowStrength);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
