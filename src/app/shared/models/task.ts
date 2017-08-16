
export interface Task {
    added: string;
    updated: string;
    celery_id: string;
    action: string;
    result: any;
    status: any;
    traceback: string;
}
