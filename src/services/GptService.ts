import OpenAIApi from 'openai'
import {FlowDefinition, MakeHttpRequestWidget, Widget} from "../model/Model";

const openai = new OpenAIApi({apiKey: process.env.OPENAI_API_KEY})

const getAiResponse = async (prompt: string): Promise<string> => {

    // console.log('getAiResponse >>> prompt', prompt.substring(0, 30))

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {'role': 'system', 'content': 'You helping to convert a Twilio Studio Flow to an AI Assistant.'},
            {'role': 'user', 'content': prompt},
        ],
    })

    const response = completion.choices[0].message.content!

    // console.log('getAiResponse >>> response', response)

    return response
}

export const generateToolName = async (widget: Widget, flowDefinition: FlowDefinition): Promise<string> => {
    const widgetName = await getAiResponse(`
    Generate me a short descriptive name for the widget below.
    Take a look at the provided flow and try to understand what exactly the widget is doing.
    The name should be 2-4 words long, written in CamelCase.
    
    The widget: ${JSON.stringify(widget)}
    
    The flow: ${JSON.stringify(flowDefinition)} 
    `);

    console.log('generateToolName >>>', widgetName)

    return widgetName;
}

export const generateToolDescription = async (widget: Widget, flowDefinition: FlowDefinition): Promise<string> => {
    const widgetName = await getAiResponse(`
    Generate me a description for this tool, it should explain to the AI Assistant when to use this tool.
    Take a look at the provided flow and try to understand what exactly the widget is doing.
    The description should be 2-5 sentences long.
    Use the word "you" in the description as if you talk to a human.
    Don't use the tool name in the description as it might change later.
    Don't describe how the tool works, details about HTTP, backend and all are not relevant.
    
    The widget: ${JSON.stringify(widget)}
    
    The flow: ${JSON.stringify(flowDefinition)} 
    `);

    console.log('generateToolDescription >>>', widgetName)

    return widgetName;
}

export const generateToolInputSchemeForHttpWidget = async (widget: MakeHttpRequestWidget, flowDefinition: FlowDefinition): Promise<string> => {
    const widgetName = await getAiResponse(`
    Generate me an input schema definition for this tool.
    
    The actual input for the widget is here:
  
    ${widget.properties.body}
    
    You should return the same set of parameters and your task is to figure out what type has those parameters.
    Take a look at the provided flow and try to understand based on the variables or values in the input what types those parameters have.
    
    Here is an example of how output schema looks like: 
    """
    export type Data = {
       customerId: string
       orderId: number
       comment: string
    }
    """
    
    In essence it is a normal JSON type definition, that declares an exported type called Data. It should always be like this.
    As the output provide only the definition, nothing else, omit adding formatting.
    
    The widget: ${JSON.stringify(widget)}
    
    The flow: ${JSON.stringify(flowDefinition)} 
    `);

    console.log('generateToolDescription >>>', widgetName)

    return widgetName;
}