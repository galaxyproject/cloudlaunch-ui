export class AppSettings {
    public static get CLOUDLAUNCH_SERVER_ROOT(): string { return ''; }
    public static get CLOUDLAUNCH_API_ENDPOINT(): string { return `${AppSettings.CLOUDLAUNCH_SERVER_ROOT}/api/v1`; }
    public static get CLOUDLAUNCH_SUPPORT_LINK(): string { return 'mailto:help@cloudlaunch.org'; }
    public static get CLOUDLAUNCH_GOOGLE_MAPS_KEY(): string { return 'AIzaSyAy6XPTnR8gFEGuzyQNE2Qrz-8b7WcvOcA'; }
}