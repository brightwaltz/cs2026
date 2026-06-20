import { Highlight, themes } from 'prism-react-renderer'

interface CodeBlockProps {
  code: string
  language?: string
}

/** prism-react-renderer による、行番号付きシンタックスハイライト表示 */
export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  return (
    <Highlight code={code.trimEnd()} language={language} theme={themes.nightOwl}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="overflow-x-auto rounded-xl p-4 text-[13px] leading-relaxed shadow-inner"
          style={style}
        >
          <code>
            {tokens.map((line, lineIndex) => {
              const lineProps = getLineProps({ line })
              return (
                <div
                  key={lineIndex}
                  {...lineProps}
                  className={`table-row ${lineProps.className ?? ''}`}
                >
                  <span className="table-cell select-none pr-4 text-right text-xs text-slate-500/70 tabular-nums">
                    {lineIndex + 1}
                  </span>
                  <span className="table-cell whitespace-pre">
                    {line.map((token, tokenIndex) => (
                      <span key={tokenIndex} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              )
            })}
          </code>
        </pre>
      )}
    </Highlight>
  )
}
