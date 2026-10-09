import React, { useState } from 'react';
import { AgentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Key, 
  Copy, 
  Check, 
  ExternalLink, 
  Code, 
  Terminal, 
  Server, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Globe,
  Zap,
  BookOpen,
  FileCode,
  Layers
} from 'lucide-react';

interface OrchestrationApiViewProps {
  agent: AgentItem;
}

export const OrchestrationApiView: React.FC<OrchestrationApiViewProps> = ({ agent }) => {
  const { showToast } = useApp();

  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'python' | 'node' | 'go'>('curl');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const [apiKeys, setApiKeys] = useState([
    { id: 'k1', key: 'app-9xKmQ81Za2LoP09w7B4dE1K90z8X', name: 'Default Production API Key', created: '2025-05-10', lastUsed: '刚刚' }
  ]);

  const curlCode = `curl -X POST 'https://api.ai-center.internal/v1/workflows/run' \\
  -H 'Authorization: Bearer app-9xKmQ81Za2LoP09w7B4dE1K90z8X' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "inputs": {
      "input_text": "需要提取关键摘要的长文本内容..."
    },
    "response_mode": "streaming",
    "user": "abc-123"
  }'`;

  const pythonCode = `import requests
import json

url = "https://api.ai-center.internal/v1/workflows/run"
headers = {
    "Authorization": "Bearer app-9xKmQ81Za2LoP09w7B4dE1K90z8X",
    "Content-Type": "application/json"
}
data = {
    "inputs": {
        "input_text": "需要提取关键摘要的长文本内容..."
    },
    "response_mode": "blocking",
    "user": "user-uuid-1002"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`;

  const nodeCode = `import fetch from 'node-fetch';

const response = await fetch('https://api.ai-center.internal/v1/workflows/run', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer app-9xKmQ81Za2LoP09w7B4dE1K90z8X',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    inputs: { input_text: '需要提取关键摘要的长文本内容...' },
    response_mode: 'streaming',
    user: 'user-001'
  })
});

const data = await response.json();
console.log(data);`;

  const goCode = `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    url := "https://api.ai-center.internal/v1/workflows/run"
    payload := map[string]interface{}{
        "inputs": map[string]string{"input_text": "需要提取关键摘要的长文本内容..."},
        "response_mode": "blocking",
        "user": "user-go-client",
    }
    body, _ := json.Marshal(payload)
    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(body))
    req.Header.Set("Authorization", "Bearer app-9xKmQ81Za2LoP09w7B4dE1K90z8X")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
    fmt.Println("Status:", resp.Status)
}`;

  const currentSnippet = 
    activeCodeTab === 'curl' ? curlCode :
    activeCodeTab === 'python' ? pythonCode :
    activeCodeTab === 'node' ? nodeCode : goCode;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showToast('已复制代码示例到剪贴板');
  };

  const handleCreateKey = () => {
    const newKey = `app-${Math.random().toString(36).substring(2, 12)}${Date.now()}`;
    setApiKeys(prev => [
      ...prev,
      {
        id: `k_${Date.now()}`,
        key: newKey,
        name: `API Key #${prev.length + 1}`,
        created: '刚刚',
        lastUsed: '从未使用'
      }
    ]);
    showToast('已成功创建全新 API 访问密钥！');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header Card (Matches 工作流应用-访问API.png) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">{agent.name} · RESTful API 接入</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl pt-1">
              通过工业级开放 API，将本智能应用的能力无缝集成到您的自有系统、钉钉/企业微信机器人、CRM 或微服务架构中。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateKey}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>创建 API 密钥</span>
            </button>
          </div>
        </div>

        {/* API Keys Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-800">活跃的 API 密钥</span>
            </div>
            <span className="text-[11px] text-slate-400">密钥拥有应用最高执行权限，请妥善保管</span>
          </div>

          <div className="space-y-2">
            {apiKeys.map((k) => (
              <div key={k.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800">{k.name}</div>
                  <div className="font-mono text-slate-600 flex items-center gap-2">
                    <span>{showKey ? k.key : `${k.key.substring(0, 10)}*****************`}</span>
                    <button 
                      onClick={() => setShowKey(!showKey)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-[11px] text-slate-400 hidden sm:block">
                    <div>创建于: {k.created}</div>
                    <div>最后调用: {k.lastUsed}</div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(k.key);
                      showToast('已复制 API 密钥');
                    }}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg border border-slate-200 cursor-pointer transition"
                    title="复制密钥"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  
                  {apiKeys.length > 1 && (
                    <button
                      onClick={() => {
                        setApiKeys(prev => prev.filter(item => item.id !== k.id));
                        showToast('已删除 API 密钥');
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-slate-200 cursor-pointer transition"
                      title="删除密钥"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Endpoint & Interactive Code Snippet */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">1. 执行运行工作流 (Run Workflow)</h3>
              <p className="text-xs text-slate-400 mt-0.5">POST /workflows/run</p>
            </div>

            {/* Language Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              {(['curl', 'python', 'node', 'go'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveCodeTab(lang)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer uppercase ${
                    activeCodeTab === lang
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Code Box */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono">{activeCodeTab.toUpperCase()} Request Sample</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white cursor-pointer px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? '已复制' : '复制代码'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed select-text">
              {currentSnippet}
            </pre>
          </div>

          {/* Response Payload Specs */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-800">响应格式 (Streaming / Blocking Response)</h4>
            <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
{`{
  "workflow_run_id": "wf_run_982b6140",
  "task_id": "task_100234",
  "data": {
    "id": "exec_01",
    "workflow_id": "${agent.id}",
    "status": "succeeded",
    "outputs": {
      "text": "【核心概要】...\\n【关键要点】..."
    },
    "error": null,
    "elapsed_time": 0.242,
    "total_tokens": 168,
    "created_at": 1715335717
  }
}`}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
