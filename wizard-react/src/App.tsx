import React from 'react'
import './App.css'
import {ConvertStudioFlow} from './ConvertStudioFlow'
import {Theme} from '@twilio-paste/theme'

function App() {
    return (
        <Theme.Provider theme='default'>
            <div className='App'>
                <ConvertStudioFlow/>
            </div>
        </Theme.Provider>
    )
}

export default App
