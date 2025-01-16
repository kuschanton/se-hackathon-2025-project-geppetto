
export interface WidgetBase {
    name: string;
    type: string;
}

export interface SendToFlexWidget extends WidgetBase {
    type: "send-to-flex";
    properties: {
        workflow: string;
        channel: string;
        attributes: string;
        priority: string;
        waitUrlMethod: string;
        waitUrl: string;
    };
}

export interface MakeHttpRequestWidget extends WidgetBase {
    type: "make-http-request";
    properties: {
        method: string;
        content_type: string;
        add_twilio_auth: boolean;
        body: string;
        url: string;
    };
}

export interface ConnectCallToWidget extends WidgetBase {
    type: "connect-call-to";
    properties: {
        caller_id: string;
        noun: string;
        to: string;
        offset: { x: number; y: number };
    };
}

export interface RunFunctionWidget extends WidgetBase {
    type: "run-function";
    properties: {
        service_sid: string;
        environment_sid: string;
        function_sid: string;
        url: string;
        offset: { x: number; y: number };
        attributes: string
    };
}

export type Widget =
    | SendToFlexWidget
    | MakeHttpRequestWidget
    | ConnectCallToWidget
    | RunFunctionWidget

export type FlowDefinition = {
    states: Widget[]
    description: string
    initial_state: string
    flags: any
};
