import { Component, forwardRef, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    NG_VALUE_ACCESSOR,
    ControlValueAccessor,
    NG_VALIDATORS,
    Validator
} from '@angular/forms';

// models
import { DockerRunConfiguration } from '../models/docker';

// services
import { DockerService } from '../services/docker_service';


const DOCKER_FILE_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DockerFileEditorComponent),
    multi: true
};

const DOCKER_FILE_CONTROL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DockerFileEditorComponent),
    multi: true
};

@Component({
    selector: 'docker-file-editor',
    templateUrl: './docker-file-editor.component.html',
    providers: [DOCKER_FILE_CONTROL_ACCESSOR, DOCKER_FILE_CONTROL_VALIDATOR]
})
export class DockerFileEditorComponent implements ControlValueAccessor, Validator {
    dockerFileForm: FormGroup;
    showAdvanced: boolean = false;
    _dockerFile: string;

    // Form Controls
    access_key: FormControl = new FormControl(null, Validators.required);
    secret_key: FormControl = new FormControl(null, Validators.required);


    get dockerFile(): string {
        return this._dockerFile;
    }
    
    @Input()
    set dockerFile(value) {
        this._dockerFile = value;
        if (value) {
            let config = this._dockerService.parseDockerFile(value);
            this.setDockerConfigFormValues(config);
        }
    }

    // Begin: implementation of ControlValueAccessor

    // the method set in registerOnChange, it is just
    // a placeholder for a method that takes one parameter,
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };

    // this is the initial value set to the component
    public writeValue(obj: any) {
        // Ignore, we only emit values based on the current
        // dockerFile
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.dockerFileForm.disable();
        } else {
            this.dockerFileForm.enable();
        }
    }
    // End: implementation of ControlValueAccessor

    // Begin: implementation of Validator interface
    public validate(c: FormControl) {
        // Delegate to form
        if (this.dockerFileForm.disabled || this.dockerFileForm.valid) {
            return null;
        } else {
            return { 'docker_config': 'invalid' };
        }
    }
    // End: implementation of Validator interface

    constructor(private fb: FormBuilder, private _dockerService: DockerService) {
        this.dockerFileForm = fb.group({
            'entrypoint': [''],
            'command': [''],
            'work_dir': [''],
            'user': [''],
            'port_mappings': fb.array([this.initPortMapping()]),
            'env_vars': fb.array([this.initEnvVar()]),
            'volumes': fb.array([this.initVolumeMapping()])
        });
        this.dockerFileForm.valueChanges.subscribe(data => this.propagateChangedValues());
    }
    
    propagateChangedValues() {
        let changedVals = this.getDirtyValues(this.dockerFileForm);
        this.propagateChange(changedVals);
    }

    getDirtyValues(control_group) {
        let dirtyValues = {};
        Object.keys(control_group.controls).forEach((control_name) => {
            let control = control_group.controls[control_name];
            if (control.dirty){
                if (control.controls) //check for nested controlGroups
                    dirtyValues[control_name] = this.getDirtyValues(control);  //recurse
                else    
                    dirtyValues[control_name] = control.value; //simple control
            }

        });
        return dirtyValues;
    }

    initPortMapping() {
        return this.fb.group({
            'container_port': [{value: '', disabled: true}, Validators.required],
            'host_port': ['']
        });
    }

    initEnvVar() {
        return this.fb.group({
            'variable': [{value: '', disabled: true}, Validators.required],
            'value': ['', Validators.required]
        });
    }

    initVolumeMapping() {
        return this.fb.group({
            'container_path': [{value: '', disabled: true}, Validators.required],
            'host_path': [''],
            'read_write': [''],
            'nocopy': ['']
        });
    }

    setDockerConfigFormValues(config: DockerRunConfiguration) {
        this.dockerFileForm.setControl('port_mappings',
                this.fb.array(config.port_mappings.map(x => this.initPortMapping())));
        this.dockerFileForm.setControl('env_vars',
                this.fb.array(config.env_vars.map(x => this.initEnvVar())));
        this.dockerFileForm.setControl('volumes',
                this.fb.array(config.volumes.map(x => this.initVolumeMapping())));
        this.dockerFileForm.patchValue(config);
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }

}
