/**
 * Hand-drawn mark: a fan of graded papers. Deliberately irregular paths and
 * round joins give it the loose, inked feel of the school's own illustrations.
 */
export const PapersMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 260 260"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="An illustration of a stack of graded papers"
  >
    <g
      stroke="currentColor"
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      {/* Back sheet, tipped left */}
      <path
        d="M60 74 L146 56 C150 55 153 57 154 61 L178 178 C179 182 176 185 172 186 L88 205 C84 206 80 203 79 199 L55 82 C54 78 56 75 60 74 Z"
        fill="white"
        fillOpacity={0.55}
      />
      {/* Middle sheet */}
      <path
        d="M74 62 L163 60 C167 60 170 63 170 67 L171 187 C171 191 168 194 164 194 L78 196 C74 196 71 193 71 189 L69 69 C69 65 71 62 74 62 Z"
        fill="white"
        fillOpacity={0.8}
      />
      {/* Front sheet, tipped right */}
      <path
        d="M92 52 L178 70 C182 71 184 74 183 78 L159 196 C158 200 155 202 151 201 L66 183 C62 182 60 179 61 175 L85 57 C86 53 89 51 92 52 Z"
        fill="white"
      />

      {/* Ruled lines on the front sheet */}
      <path d="M95 84 L160 97" opacity={0.75} />
      <path d="M91 102 L156 115" opacity={0.75} />
      <path d="M87 120 L133 129" opacity={0.75} />

      {/* A loosely circled top mark */}
      <path
        d="M104 149 C96 147 89 152 88 160 C86 169 92 177 101 179 C111 181 119 176 121 167 C123 157 116 149 106 147"
        strokeWidth={3.8}
      />
      <path d="M99 163 L104 169 L113 156" strokeWidth={3.4} />

      {/* Pencil, resting across the corner */}
      <path d="M170 128 L207 136 L204 149 L167 141 Z" fill="white" />
      <path d="M207 136 L216 132 L213 152 L204 149 Z" fill="white" />
      <path d="M170 128 L167 141" opacity={0.75} />
    </g>
  </svg>
);
