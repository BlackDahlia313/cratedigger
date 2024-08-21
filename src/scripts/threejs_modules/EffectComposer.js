/**
 * @author alteredq / http://alteredqualia.com/
 */

import * as THREE from 'three';
import { CopyShader } from './CopyShader.js';
import { ShaderPass } from './ShaderPass.js';
import { MaskPass, ClearMaskPass } from './MaskPass.js';

class EffectComposer {
    constructor(renderer, renderTarget) {
        this.renderer = renderer;

        if (renderTarget === undefined) {
            const width = window.innerWidth || 1;
            const height = window.innerHeight || 1;
            const parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

            renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);
        }

        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;

        this.passes = [];

        if (CopyShader === undefined)
            console.error("THREE.EffectComposer relies on CopyShader");

        this.copyPass = new ShaderPass(CopyShader);
    }

    swapBuffers() {
        const tmp = this.readBuffer;
        this.readBuffer = this.writeBuffer;
        this.writeBuffer = tmp;
    }

    addPass(pass) {
        this.passes.push(pass);
    }

    insertPass(pass, index) {
        this.passes.splice(index, 0, pass);
    }

    render(delta) {
        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;

        let maskActive = false;

        for (let i = 0, il = this.passes.length; i < il; i++) {
            const pass = this.passes[i];

            if (!pass.enabled) continue;

            pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);

            if (pass.needsSwap) {
                if (maskActive) {
                    const context = this.renderer.context;

                    context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);

                    this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);

                    context.stencilFunc(context.EQUAL, 1, 0xffffffff);
                }

                this.swapBuffers();
            }

            if (pass instanceof MaskPass) {
                maskActive = true;
            } else if (pass instanceof ClearMaskPass) {
                maskActive = false;
            }
        }
    }

    reset(renderTarget) {
        if (renderTarget === undefined) {
            renderTarget = this.renderTarget1.clone();

            renderTarget.width = window.innerWidth;
            renderTarget.height = window.innerHeight;
        }

        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;
    }

    setSize(width, height) {
        const renderTarget = this.renderTarget1.clone();

        renderTarget.width = width;
        renderTarget.height = height;

        this.reset(renderTarget);
    }
}

THREE.EffectComposer = EffectComposer;

export { EffectComposer };
