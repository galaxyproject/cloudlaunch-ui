import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { LayoutModule } from '../shared/layout.module';
import { MyAppliancesRoutingModule } from './my-appliances-routing.module';

import { MatDialogModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material';

// Components
import { DeploymentsComponent } from './components/deployments/deployments.component';
import { DeploymentComponent } from './components/deployments/deployment/deployment.component';
import { HealthCheckTaskStatusRenderer } from './components/deployments/task-status-renderers/health-check-task-status-renderer/health-check-task-status-renderer.component';
import { LaunchTaskStatusRenderer } from './components/deployments/task-status-renderers/launch-task-status-renderer/launch-task-status-renderer.component';
import { DeleteTaskStatusRenderer } from './components/deployments/task-status-renderers/delete-task-status-renderer/delete-task-status-renderer.component';
import { MyAppliancesPageComponent } from './components/my-appliances-page/my-appliances-page.component';
import { ArchiveDeleteConfirmDialog } from './components/deployments/dialogs/archive-delete-confirm.component';
import { LaunchHistoryPageComponent } from './components/launch-history-page/launch-history-page.component';

// Services
import { DeploymentService } from '../shared/services/deployment.service';
import { ProfileService } from '../shared/services/profile.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LayoutModule,
        ClipboardModule,
        MyAppliancesRoutingModule,
        MatDialogModule,
        MatButtonModule,
        MatTooltipModule
    ],
    declarations: [MyAppliancesPageComponent, LaunchHistoryPageComponent, DeploymentsComponent,
      DeploymentComponent, HealthCheckTaskStatusRenderer, LaunchTaskStatusRenderer, DeleteTaskStatusRenderer, ArchiveDeleteConfirmDialog],
    providers: [DeploymentService, ProfileService]
})
export class MyAppliancesModule { }
