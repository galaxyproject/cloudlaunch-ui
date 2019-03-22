import { Component, ComponentRef, ViewContainerRef, ViewChild, OnDestroy, Input } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core/src/linker/component_factory_resolver';
import { CompilerFactory } from '@angular/core';

declare var System: any;

import { DeploymentTarget } from '../../../shared/models/deployment';

@Component({
    selector: 'clui-plugin-placeholder',
    template: `<span #content></span>`
})
export class AppPlaceHolderComponent implements OnDestroy {
    _target: DeploymentTarget;
    _initialConfig: any;
    _componentPath: string;
    _componentName: string;
    _currentComponent: ComponentRef<any>;

    get componentPath() {
        return this._componentPath;
    }

    @Input()
    set componentPath(value) {
        this.reloadComponentIfNeeded(value, this.componentName);
        this._componentPath = value;
    }

    get componentName() {
        return this._componentName;
    }

    @Input()
    set componentName(value) {
        this.reloadComponentIfNeeded(this.componentPath, value);
        this._componentName = value;
    }

    get initialConfig() {
        return this._initialConfig;
    }

    @Input()
    set initialConfig(value) {
        this._initialConfig = value;
        if (this._currentComponent) {
            this._currentComponent.instance.initialConfig = value;
        }
    }

    get target() {
        return this._target;
    }

    @Input()
    set target(value) {
        this._target = value;
        if (this._currentComponent) {
            this._currentComponent.instance.target = value;
        }
    }

    constructor(
        private viewContainerRef: ViewContainerRef, private compilerFactory: CompilerFactory) {
    }

    private reloadComponentIfNeeded(componentPath: string, componentName: string) {
        if (componentPath && componentName && (this.componentPath !== componentPath || this.componentName !== componentName)) {
            this.reloadComponent();
        }
    }

    private reloadComponent() {
        // Remove existing component
        if (this._currentComponent && this.viewContainerRef.length > 0) {
            this.viewContainerRef.remove(0);
        }
        // Add new component

        const [modulePath, moduleName] = this.componentPath.split('#');
        // Workaround so webpack has context for the chunk - hardcoded import of module
        // System.import(this.componentPath)
        System.import('app/catalog/plugins/plugins.module')
            .then((module: any) => {
                return module[moduleName];
            })
            .then((type: any) => {
                const compiler = this.compilerFactory.createCompiler();
                return compiler.compileModuleAndAllComponentsAsync(type);
            })
            .then((moduleWithFactories: any) => {
                const componentSelector = this.componentName;
                const factory = moduleWithFactories.componentFactories.find((x: any) => x.selector === componentSelector);
                this._currentComponent = this.viewContainerRef.createComponent(factory, 0, this.viewContainerRef.injector);
                this._currentComponent.instance.initialConfig = this.initialConfig;
                this._currentComponent.instance.target = this.target;
            });
    }

    ngOnDestroy() {
        if (this._currentComponent) {
          this._currentComponent.destroy();
        }
    }
}
