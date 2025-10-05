import React, { useMemo, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function ArticleSplitView({ article, onBack }) {
  if (!article) return null;

  const [useTextProxy, setUseTextProxy] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState(null);
  const [insightsContent, setInsightsContent] = useState("");
  const [risksLoading, setRisksLoading] = useState(false);
  const [risksError, setRisksError] = useState(null);
  const [risksContent, setRisksContent] = useState("");
  const [notesContent, setNotesContent] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  const { isEmbeddable, iframeSrc } = useMemo(() => {
    try {
      const url = new URL(article.link || '');
      const blockedDomains = ['pmc.ncbi.nlm.nih.gov', 'www.ncbi.nlm.nih.gov'];
      const blocked = blockedDomains.includes(url.host);
      const src = useTextProxy
        ? `https://r.jina.ai/http://${url.host}${url.pathname}${url.search}`
        : article.link;
      return { isEmbeddable: !blocked || useTextProxy, iframeSrc: src };
    } catch {
      return { isEmbeddable: true, iframeSrc: article.link };
    }
  }, [article.link, useTextProxy]);

  const handleGenerateInsights = async () => {
    if (!article?.id) return;
    setInsightsLoading(true);
    setInsightsError(null);
    setInsightsContent("");
    try {
      // 1) Fetch abstract text by article id; if unavailable, fall back to text proxy
      const articleAbstract = await (async () => {
        try {
          const absRes = await fetch(`http://192.168.137.229:8000/abstracts/${article.id}`);
          if (absRes.ok) {
            const absJson = await absRes.json();
            if (absJson?.abstract) return absJson.abstract;
          }
        } catch {}
        // Fallback to text proxy of the article link
        if (article?.link) {
          try {
            const url = new URL(article.link);
            const proxyUrl = `https://r.jina.ai/http://${url.host}${url.pathname}${url.search}`;
            const txt = await fetch(proxyUrl).then(r => r.text());
            // Trim very large text to keep prompt size reasonable
            return (txt || "").slice(0, 12000);
          } catch {}
        }
        return "";
      })();

      if (!articleAbstract) {
        throw new Error("No abstract or text view available for this article");
      }

      // 2) Call chat endpoint with specified messages
      const chatRes = await fetch(`http://192.168.137.229:8000/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a expert in obtaining insights and key words.' },
            { role: 'user', content: articleAbstract }
          ]
        })
      });
      if (!chatRes.ok) {
        throw new Error(`Chat request failed (status ${chatRes.status})`);
      }
      const chatJson = await chatRes.json();
      setInsightsContent(chatJson?.content || "");
    } catch (err) {
      setInsightsError(err?.message || 'Failed to generate insights');
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleGenerateRisksMitigations = async () => {
    if (!article?.id) return;
    setRisksLoading(true);
    setRisksError(null);
    setRisksContent("");
    try {
      // 1) Fetch abstract text by article id; if unavailable, fall back to text proxy
      const articleAbstract = await (async () => {
        try {
          const absRes = await fetch(`http://192.168.137.229:8000/abstracts/${article.id}`);
          if (absRes.ok) {
            const absJson = await absRes.json();
            if (absJson?.abstract) return absJson.abstract;
          }
        } catch {}
        if (article?.link) {
          try {
            const url = new URL(article.link);
            const proxyUrl = `https://r.jina.ai/http://${url.host}${url.pathname}${url.search}`;
            const txt = await fetch(proxyUrl).then(r => r.text());
            return (txt || "").slice(0, 12000);
          } catch {}
        }
        return "";
      })();

      if (!articleAbstract) {
        throw new Error("No abstract or text view available for this article");
      }

      // 2) Call chat endpoint requesting risks and mitigations in markdown
      const chatRes = await fetch(`http://192.168.137.229:8000/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are an expert at identifying risks and proposing practical mitigations from a scientific abstract. Respond concisely in Markdown with two sections:\n\n## Risks\n- bullet list\n\n## Mitigations\n- bullet list' },
            { role: 'user', content: articleAbstract }
          ]
        })
      });
      if (!chatRes.ok) {
        throw new Error(`Chat request failed (status ${chatRes.status})`);
      }
      const chatJson = await chatRes.json();
      setRisksContent(chatJson?.content || "");
    } catch (err) {
      setRisksError(err?.message || 'Failed to generate risks & mitigations');
    } finally {
      setRisksLoading(false);
    }
  };

  // Load and persist notes per-article
  useEffect(() => {
    if (!article?.id) return;
    try {
      const key = `articleNotes:${article.id}`;
      const existing = localStorage.getItem(key);
      setNotesContent(existing || "");
      setNotesSaved(false);
    } catch {
      // noop if storage unavailable
    }
  }, [article?.id]);

  const handleSaveNotes = () => {
    if (!article?.id) return;
    try {
      const key = `articleNotes:${article.id}`;
      localStorage.setItem(key, notesContent || "");
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 1500);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-[#0B3D91] text-white">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-base md:text-lg font-semibold truncate">
            {article.title}
          </h2>
        </div>
        {article.link && (
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-white/10"
          >
            <ExternalLink className="w-4 h-4" />
            Open original
          </a>
        )}
      </div>

      {/* Body: Split View */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Iframe */}
        <div className="flex-1 min-w-0 bg-gray-50 border-r border-gray-200">
          {article.link ? (
            isEmbeddable ? (
              <iframe
                src={iframeSrc}
                title={article.title || 'Document'}
                className="w-full h-full"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center p-6">
                <Card className="max-w-lg w-full p-4 text-center">
                  <h4 className="text-base font-semibold text-gray-800 mb-2">This site blocks embedding</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    The source website prevents loading inside the app for security. Open it in a new tab or try a read-only text view.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#0B3D91] text-white hover:bg-[#0a347b]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open original
                    </a>
                    <Button variant="outline" onClick={() => setUseTextProxy(true)}>
                      Try text view
                    </Button>
                  </div>
                </Card>
              </div>
            )
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-500">
              No document link available
            </div>
          )}
        </div>

        {/* Right: Options panel */}
        <div className="w-full md:w-[380px] lg:w-[440px] xl:w-[520px] bg-white">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-[#0B3D91] font-semibold">Options</h3>
              <p className="text-sm text-gray-500">Insights, risks & mitigations, and more</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">Insights</h4>
                  <Button size="sm" disabled={insightsLoading} onClick={handleGenerateInsights}>
                    {insightsLoading ? 'Generating…' : 'Generate'}
                  </Button>
                </div>
                {insightsError && (
                  <p className="text-sm text-red-600 mb-2">{insightsError}</p>
                )}
                {insightsContent ? (
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown>{insightsContent.replace(/\r?\n/g, '  \n')}</ReactMarkdown>
                  </div>
                ) : (
                  !insightsLoading && !insightsError && (
                    <p className="text-sm text-gray-600">Click Generate to get AI insights and keywords.</p>
                  )
                )}
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">Risks & Mitigations</h4>
                  <Button size="sm" disabled={risksLoading} onClick={handleGenerateRisksMitigations}>
                    {risksLoading ? 'Generating…' : 'Generate'}
                  </Button>
                </div>
                {risksError && (
                  <p className="text-sm text-red-600 mb-2">{risksError}</p>
                )}
                {risksContent ? (
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown>{risksContent.replace(/\r?\n/g, '  \n')}</ReactMarkdown>
                  </div>
                ) : (
                  !risksLoading && !risksError && (
                    <p className="text-sm text-gray-600">Click Generate to extract risks and suggested mitigations.</p>
                  )
                )}
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">Notes</h4>
                  <div className="flex items-center gap-2">
                    {notesSaved && <span className="text-xs text-green-600">Saved</span>}
                    <Button size="sm" variant="outline" onClick={handleSaveNotes}>Save</Button>
                  </div>
                </div>
                <textarea
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  placeholder="Write your notes here..."
                  className="w-full h-40 md:h-48 resize-y rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 focus:border-[#0B3D91] bg-white"
                />
              </Card>
            </div>
            <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={onBack}>Close</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


