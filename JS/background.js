import * as THREE from "three";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100
);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(
    window.innerWidth,
    window.innerHeight
);
const material = new THREE.ShaderMaterial({
    uniforms: {
    u_time: { value: 1.0 },
    u_resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    },
    vertexShader: getShaders().vertexShader,
    fragmentShader: getShaders().fragmentShader,
});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
animate();

function animate() {
    requestAnimationFrame(animate);
    material.uniforms.u_time.value += 0.01;
    renderer.render(scene, camera);
}

function getShaders() {
    let vertexShader = `
    void main() {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
    }
    `;
    let fragmentShader = `
    #define PI 3.141592653589793
    #define cx_div(a, b) vec2(((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y)),((a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y)))

    vec2 as_polar(vec2 z) {
        return vec2(
        length(z),
        atan(z.y, z.x)
        );
    }

    vec2 cx_log(vec2 a) {
        vec2 polar = as_polar(a);
        float rpart = polar.x;
        float ipart = polar.y;
        if (ipart > PI) ipart=ipart-(2.0*PI);
        return vec2(log(rpart),ipart);
    }

    vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
        return a + b*cos( 0.38*2.*PI*(c*t+d) );
    }

    uniform float u_time;
    uniform vec2 u_resolution;

    void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
        vec2 z = uv;

        float angle = sin(u_time/5.) * 2. * PI;
        float length = .2;

        // Spin our points in a circle of radius length
        float c = cos(angle);
        float s = sin(angle);
        vec2 p = vec2( s*length, c*length);
        vec2 q = vec2( s*-length, c*-length );

        // Divide z-p by z-q using complex division
        vec2 division = cx_div((z - p), (z - q));

        // Calculate the log of our division
        vec2 log_p_over_q = cx_log(division);

        // Extract the imaginary number
        float imaginary = log_p_over_q.y / PI;

        vec3 col = palette( imaginary, vec3(0.50,.52,0.53), vec3(.46,.32,.35), vec3(.82,.84,.65), vec3(0.53,0.23,0.22));

        gl_FragColor = vec4(col, 1.0);
    }
    `;

    return {
    vertexShader,
    fragmentShader,
    };
}