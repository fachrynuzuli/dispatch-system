# Fleet Dispatch System - AI Routing Architecture

This diagram illustrates the routing architecture, showing the split between button-triggered premium tasks and the conversational chat fallback loops.

```mermaid
flowchart TD
    %% Styling
    classDef client fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef input fill:#e1f5fe,stroke:#0277bd,stroke-width:2px;
    classDef process fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef logic fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef model fill:#fff,stroke:#666,stroke-width:1px,stroke-dasharray: 5 5;
    classDef error fill:#ffebee,stroke:#c62828,stroke-width:2px;
    classDef output fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px;

    %% Client Layer
    subgraph Client ["Client Application"]
        UI_Buttons["Dashboard Action Buttons
        (Optimize, Analyze, Summarize)"]:::client
        UI_Chat["Fleet Assistant Chatbox"]:::client
        Result["Final Result Displayed"]:::client
    end

    %% Input Layer
    subgraph Input ["Input Layer / Context Assembly"]
        %% Premium workflows
        ReqInsp["Safety Inspection"]:::input
        ReqDisp["Dispatch Optimization"]:::input
        ReqAsset["Asset Lifespan Prediction"]:::input
        ReqInv["Inventory Needs Analysis"]:::input
        ReqVessel["Vessel Arrival Logistics"]:::input
        
        %% Free workflow
        ReqChat["Fleet Assistant Chat"]:::input
    end

    %% Processing Layer (OpenRouterService)
    subgraph Service ["OpenRouter Service (chatCompletion)"]
        
        Router{"Task Classifier"}:::process
        
        %% Tier 1
        subgraph Tier1 ["Tier 1: Premium & Structural (High Patience)"]
            T1_Config["Capability: PAID Models Only
            Timeout: 10s - 12s
            Mode: JSON or Text"]:::logic
            
            M_D3["1. DeepSeek v3.2"]:::model
            M_G2["2. Gemini 2.5 Flash Lite"]:::model
            M_MM["3. Minimax m2.5"]:::model
            
            T1_Config --> M_D3
            M_D3 -- "Fail / Timeout" --> M_G2
            M_G2 -- "Fail / Timeout" --> M_MM
        end
        
        %% Tier 2
        subgraph Tier2 ["Tier 2: Conversational (Low Latency)"]
            T2_Config["Capability: FREE -> PAID Fallback
            Timeout: 4s
            Mode: Text Only"]:::logic
            
            M_K2["1. Kimi k2.5"]:::model
            M_GLM["2. GLM 4.5 Air"]:::model
            M_GEM["3. Gemma 4"]:::model
            M_PaidFallback["4. Paid Models Array"]:::model
            
            T2_Config --> M_K2
            M_K2 -- "Fail / Timeout" --> M_GLM
            M_GLM -- "Fail / Timeout" --> M_GEM
            M_GEM -- "Fail / Timeout" --> M_PaidFallback
        end

        ValJSON{"Is JSON Valid?
        (Dispatch Only)"}:::process
        ErrorReturn["Return Empty Array []
        (Safe UI Fallback)"]:::error
    end

    %% Connections
    UI_Buttons --> ReqInsp
    UI_Buttons --> ReqDisp
    UI_Buttons --> ReqAsset
    UI_Buttons --> ReqInv
    UI_Buttons --> ReqVessel
    
    UI_Chat --> ReqChat

    ReqInsp & ReqDisp & ReqAsset & ReqInv & ReqVessel --> Router
    ReqChat --> Router

    Router -- "Button-Based Actions" --> T1_Config
    Router -- "Chat Assistant" --> T2_Config

    %% Outputs
    SubGraphOutputs[" "]
    
    M_MM -- Success --> RawOut1["Raw Output"]:::output
    M_D3 -- Success --> RawOut1
    M_G2 -- Success --> RawOut1

    M_PaidFallback -- Success --> RawOut2["Raw Chat Output"]:::output
    M_K2 -- Success --> RawOut2
    M_GLM -- Success --> RawOut2
    M_GEM -- Success --> RawOut2

    RawOut1 -- "If Dispatch" --> ValJSON
    RawOut1 -- "If Text" --> Result
    
    RawOut2 --> Result

    ValJSON -- Yes --> Result
    ValJSON -- No --> ErrorReturn
    
    ErrorReturn --> Result
```
