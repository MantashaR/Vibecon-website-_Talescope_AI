import React, { useState, useRef } from 'react'
import {
  Sparkles, Wand2, BookOpen, Type, BarChart2,
  Lightbulb, RefreshCw, X, Copy, Check, ChevronDown
} from 'lucide-react'
import {
  continueStory, improveWriting, generatePoem,
  suggestTitle, analyzeTone, expandIdea, rephraseText
} from '../services/aiService'
import '../styles/ai-assistant.css'

const ACTIONS = [
  { id: 'continue',  label: 'Continue Story',  icon: BookOpen,  color: 'blue',   desc: 'Let AI continue your story'         },
  { id: 'improve',   label: 'Improve Writing',  icon: Wand2,     color: 'purple', desc: 'Polish clarity and flow'            },
  { id: 'poem',      label: 'Generate Poem',    icon: Sparkles,  color: 'pink',   desc: 'Create a poem from a topic'        },
  { id: 'title',     label: 'Suggest Titles',   icon: Type,      color: 'yellow', desc: '5 title ideas for your work'       },
  { id: 'tone',      label: 'Analyze Tone',     icon: BarChart2, color: 'green',  desc: 'Understand your writing\'s mood'   },
  { id: 'expand',    label: 'Expand Idea',      icon: Lightbulb, color: 'orange', desc: 'Turn a concept into an outline'    },
  { id: 'rephrase',  label: 'Rephrase',         icon: RefreshCw, color: 'teal',   desc: 'Rewrite in a different tone'       },
]

const GENRES   = ['general','fantasy','romance','thriller','sci-fi','horror','literary']
const TONES    = ['neutral','formal','casual','dramatic','poetic','humorous']
const STYLES   = ['free verse','haiku','sonnet','ballad','ode','limerick']

export default function AIWritingAssistant({ initialText = '' }) {
  const [inputText,   setInputText]   = useState(initialText)
  const [result,      setResult]      = useState('')
  const [activeAction,setActiveAction]= useState(null)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [copied,      setCopied]      = useState(false)
  const [genre,       setGenre]       = useState('general')
  const [tone,        setTone]        = useState('neutral')
  const [poemStyle,   setPoemStyle]   = useState('free verse')
  const [poemTopic,   setPoemTopic]   = useState('')
  const [expandIdea_,  setExpandIdea_]  = useState('')
  const resultRef = useRef(null)

  const run = async (actionId) => {
    setError('')
    setResult('')
    setActiveAction(actionId)
    setLoading(true)

    try {
      let output = ''
      switch (actionId) {
        case 'continue': output = await continueStory(inputText, genre);        break
        case 'improve':  output = await improveWriting(inputText);              break
        case 'poem':     output = await generatePoem(poemTopic || inputText, poemStyle); break
        case 'title':    output = await suggestTitle(inputText);                break
        case 'tone':     output = await analyzeTone(inputText);                 break
        case 'expand':   output = await expandIdea(expandIdea_ || inputText);   break
        case 'rephrase': output = await rephraseText(inputText, tone);          break
      }
      setResult(output)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copyResult = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const useResult = () => {
    setInputText(prev => prev + '\n\n' + result)
    setResult('')
  }

  return (
    <div className="ai-assistant">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-left">
          <Sparkles className="ai-header-icon" />
          <div>
            <h2 className="ai-title">AI Writing Assistant</h2>
            <p className="ai-subtitle">Powered by Claude</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="ai-input-section">
        <label className="ai-label">Your Writing</label>
        <textarea
          className="ai-textarea"
          rows={6}
          placeholder="Paste your story, poem, or idea here…"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <div className="ai-input-meta">
          <span>{inputText.trim().split(/\s+/).filter(Boolean).length} words</span>
          <span>{inputText.length} chars</span>
        </div>
      </div>

      {/* Context Controls */}
      <div className="ai-controls">
        <div className="ai-control-group">
          <label className="ai-label-sm">Genre</label>
          <div className="ai-select-wrap">
            <select className="ai-select" value={genre} onChange={e => setGenre(e.target.value)}>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <ChevronDown className="ai-select-icon" />
          </div>
        </div>
        <div className="ai-control-group">
          <label className="ai-label-sm">Rephrase tone</label>
          <div className="ai-select-wrap">
            <select className="ai-select" value={tone} onChange={e => setTone(e.target.value)}>
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown className="ai-select-icon" />
          </div>
        </div>
        <div className="ai-control-group">
          <label className="ai-label-sm">Poem style</label>
          <div className="ai-select-wrap">
            <select className="ai-select" value={poemStyle} onChange={e => setPoemStyle(e.target.value)}>
              {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="ai-select-icon" />
          </div>
        </div>
      </div>

      {/* Poem topic / Expand idea quick inputs */}
      <div className="ai-quick-inputs">
        <input
          className="ai-quick-input"
          placeholder="Poem topic (optional, overrides text above)"
          value={poemTopic}
          onChange={e => setPoemTopic(e.target.value)}
        />
        <input
          className="ai-quick-input"
          placeholder="Idea to expand (optional, overrides text above)"
          value={expandIdea_}
          onChange={e => setExpandIdea_(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="ai-actions-grid">
        {ACTIONS.map(({ id, label, icon: Icon, color, desc }) => (
          <button
            key={id}
            className={`ai-action-btn ai-action-${color} ${activeAction === id && loading ? 'ai-action-loading' : ''}`}
            onClick={() => run(id)}
            disabled={loading}
            title={desc}
          >
            <Icon className="ai-action-icon" />
            <span className="ai-action-label">{label}</span>
            {activeAction === id && loading && <span className="ai-spinner" />}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="ai-error">
          <span>⚠ {error}</span>
          <button onClick={() => setError('')}><X size={14} /></button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="ai-result" ref={resultRef}>
          <div className="ai-result-header">
            <span className="ai-result-label">
              {ACTIONS.find(a => a.id === activeAction)?.label} result
            </span>
            <div className="ai-result-actions">
              <button className="ai-result-btn" onClick={useResult} title="Append to your text">
                Use this
              </button>
              <button className="ai-result-btn" onClick={copyResult}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button className="ai-result-btn ai-result-close" onClick={() => setResult('')}>
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="ai-result-body">
            {result.split('\n').map((line, i) => (
              <p key={i} className={line.trim() === '' ? 'ai-result-gap' : ''}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
