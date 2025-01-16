import express, {Request, Response} from 'express';
import {getAssistant, getStudioFlow} from "./services/TwilioClient";
import {createToolsForFlow} from "./services/WidgetConverter";
import {FlowInstance} from "twilio/lib/rest/studio/v2/flow";
import {FlowDefinition} from "./model/Model";
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;


// Middleware to parse JSON bodies
app.use(express.json());

// Properly configure CORS
app.use(
    cors({
        origin: "http://localhost:3000", // Allow requests from this origin
        methods: ["GET", "POST", "OPTIONS"], // Allow these HTTP methods
        allowedHeaders: ["Content-Type"], // Allow these headers
    })
);


// Define the "convert" POST endpoint
interface ConvertRequest {
    flowSid: string;
    agentName: string;
    businessName: string;
}

app.post('/convert', async (req, res) => {
    console.log('convert >>>', req.body)
    try {

        const request: ConvertRequest = req.body
        // const flow = await getStudioFlow(request.flowSid)
        // console.log('flowJson >>>', JSON.stringify(flow.definition, null, 2))
        // await getAssistant('aia_asst_0194511f-3d39-7dd3-8224-58fbdb6e498a')
        // await createToolsForFlow(flow.definition as FlowDefinition, 'aia_asst_0194511f-3d39-7dd3-8224-58fbdb6e498a')


        res.status(200).json({status: 'OK'});
    } catch (err) {
        console.error('err >>>', err)
        res.status(500).json({status: 'ERR'});
    }


})


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
