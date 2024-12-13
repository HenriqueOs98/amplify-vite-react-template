'use client'

import { useState, useRef, useCallback } from "react"
import { Play, Copy, Settings, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface CodeEditorProps {
  initialCode: {
    language: string;
    code: string;
  };
  solution: {
    language: string;
    code: string;
  };
}

export default function CodeEditor({ initialCode, solution }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode.code)
  const [output, setOutput] = useState("")
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const handleRun = useCallback(() => {
    const worker = new Worker(
      URL.createObjectURL(
        new Blob(
          [
            `
            let logs = [];
            console.log = (...args) => {
              logs.push(args.map(arg => String(arg)).join(' '));
            };

            onmessage = function(e) {
              try {
                const result = eval(e.data);
                postMessage({ 
                  result: result !== undefined ? String(result) : undefined,
                  logs: logs 
                });
              } catch (error) {
                postMessage({ error: error.message });
              }
            }
            `
          ],
          { type: "application/javascript" }
        )
      )
    )

    worker.onmessage = ({ data }) => {
      if (data.error) {
        setOutput(`Error: ${data.error}`)
      } else {
        const output = [...(data.logs || []), data.result !== undefined ? data.result : ""]
          .filter(Boolean)
          .join("\n")
        setOutput(output)
      }
      worker.terminate()
    }

    worker.postMessage(code)
  }, [code])

  const handleValidate = useCallback(() => {
    const isCorrect = code.trim() === solution.code.trim()
    if (isCorrect) {
      toast.success('Correct solution!', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    } else {
      toast.error('Not quite right. Try again!', {
        icon: '🤔',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    }
  }, [code, solution.code])

  const handleResetCode = useCallback(() => {
    setCode(initialCode.code)
    setOutput("")
  }, [initialCode.code])

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground cyberpunk-border">
      <div className="p-2 sm:p-4 border-b border-border">
        <div className="flex items-center">
          <div className="flex-1">
            <span className="font-orbitron text-xs sm:text-sm cyberpunk-glow">
              {initialCode.language} Editor
            </span>
          </div>
        </div>
      </div>
      <div className="flex-grow h-[60%] relative min-h-[200px]">
        <textarea
          ref={editorRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-transparent font-mono p-2 sm:p-4 resize-none focus:outline-none text-foreground text-sm sm:text-base"
          spellCheck="false"
        />
      </div>
      <div className="border-t border-border p-2 sm:p-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleRun} className="flex items-center space-x-2">
            <Play className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-orbitron font-orbitron-bold text-xs sm:text-sm">Execute</span>
          </Button>
          <Button onClick={handleValidate} variant="secondary" className="flex items-center space-x-2">
            <span className="font-orbitron font-orbitron-bold text-xs sm:text-sm">Validate</span>
          </Button>
          <Button onClick={handleResetCode} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-orbitron font-orbitron-semibold text-xs sm:text-sm">Reset</span>
          </Button>
          <div className="flex space-x-1 sm:space-x-2">
            <Button onClick={handleResetCode} variant="ghost" size="icon" className="p-1.5 sm:p-2">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="p-1.5 sm:p-2">
              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="p-1.5 sm:p-2">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[40%] border-t border-border overflow-hidden flex flex-col">
        <div className="p-2 sm:p-4 flex-grow overflow-hidden flex flex-col">
          <h3 className="font-orbitron text-xs sm:text-sm mb-2 cyberpunk-glow">Neural Interface</h3>
          <pre className="font-mono text-xs sm:text-sm whitespace-pre-wrap bg-muted p-2 sm:p-4 rounded-md text-foreground flex-grow overflow-auto">{output}</pre>
        </div>
      </div>
    </div>
  )
}

