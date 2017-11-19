import { Component, ComponentRef, ViewContainerRef, ViewChild, OnDestroy } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core/src/linker/component_factory_resolver';
import { CompilerFactory } from '@angular/core';

declare var System: any;

import { Cloud } from '../../../shared/models/cloud';

@Component({
    selector: 'app-placeholder',
    template: `<span #content></span>`,
    inputs: ['initialConfig', 'componentPath', 'componentName', 'cloud'],
})
export class AppPlaceHolderComponent implements OnDestroy {
    _cloud: Cloud;
    _initialConfig: any;
    _componentPath: string;
    _componentName: string;
    _currentComponent: ComponentRef<any>;

    get componentPath() {
        return this._componentPath;
    }

    set componentPath(value) {
        this.reloadComponentIfNeeded(value, this.componentName);
        this._componentPath = value;
    }

    get componentName() {
        return this._componentName;
    }

    set componentName(value) {
        this.reloadComponentIfNeeded(this.componentPath, value);
        this._componentName = value;
    }

    get initialConfig() {
        return this._initialConfig;
    }

    set initialConfig(value) {
        this._initialConfig = value;
        if (this._currentComponent)
            this._currentComponent.instance.initialConfig = value;
    }

    get cloud() {
        return this._cloud;
    }

    set cloud(value) {
        this._cloud = value;
        if (this._currentComponent)
            this._currentComponent.instance.cloud = value;
    }

    constructor(
        private viewContainerRef: ViewContainerRef, private compilerFactory: CompilerFactory) {
    }

    private reloadComponentIfNeeded(componentPath: string, componentName: string) {
        if (componentPath && componentName && (this.componentPath != componentPath || this.componentName != componentName))
            this.reloadComponent();
    }

    private reloadComponent() {
        // Remove existing component
        if (this._currentComponent && this.viewContainerRef.length > 0) {
            this.viewContainerRef.remove(0);
        }
        // Add new component

        let [modulePath, moduleName] = this.componentPath.split("#");
        // Workaround so webpack has context for the chunk - hardcoded import of module
        // System.import(this.componentPath)
        System.import('app/catalog/plugins/plugins.module')
            .then((module: any) => {
                return module[moduleName];
            })
            .then((type: any) => {
                let compiler = this.compilerFactory.createCompiler();
                return compiler.compileModuleAndAllComponentsAsync(type)
            })
            .then((moduleWithFactories => {
                let componentSelector = this.componentName;
                const factory = moduleWithFactories.componentFactories.find(x => x.selector === componentSelector);
                this._currentComponent = this.viewContainerRef.createComponent(factory, 0, this.viewContainerRef.injector);
                this._currentComponent.instance.initialConfig = this.initialConfig;
                this._currentComponent.instance.cloud = this.cloud;
            }));
    }

    ngOnDestroy() {
        if(this._currentComponent) {
          this._currentComponent.destroy();
        }
    }
}
