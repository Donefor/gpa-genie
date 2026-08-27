/**
 * Hand-drawn mark: a fan of graded papers.
 *
 * Every edge is a curve rather than a straight line, corners overshoot a
 * little, and the stroke weight varies between elements — the small
 * irregularities are what make it read as inked by hand rather than plotted.
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
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* Back sheet — tipped left, edges bowing slightly outward */}
      <path
        d="M63 79 C61 74 63 71 68 70 C95 63 122 57 149 51 C154 50 157 52 158 57
           C165 96 172 134 179 173 C180 178 178 181 173 182 C146 189 119 195 92 201
           C87 202 84 200 83 195 C76 156 70 118 63 79 Z"
        fill="white"
        fillOpacity={0.5}
        strokeWidth={3}
      />

      {/* Middle sheet — barely tilted, one corner slightly lifted */}
      <path
        d="M76 65 C75 61 77 58 81 58 C109 57 137 57 165 57 C169 57 172 60 172 64
           C173 104 173 144 172 184 C172 188 169 191 165 191 C137 192 109 192 81 191
           C77 191 74 188 74 184 C74 144 75 104 76 65 Z"
        fill="white"
        fillOpacity={0.82}
        strokeWidth={3.2}
      />

      {/* Front sheet — tipped right, long edges gently bowed */}
      <path
        d="M95 51 C96 47 99 45 104 46 C131 51 158 57 185 63 C189 64 191 67 190 72
           C182 111 174 149 165 188 C164 193 161 195 156 194 C129 188 102 182 75 176
           C71 175 69 172 70 167 C78 128 86 90 95 51 Z"
        fill="white"
        strokeWidth={3.6}
      />

      {/* Ruled lines — wavering, uneven lengths, as if written */}
      <path d="M104 82 C124 85 144 89 165 94" strokeWidth={2.6} opacity={0.7} />
      <path d="M100 100 C121 104 141 108 161 112" strokeWidth={2.6} opacity={0.7} />
      <path d="M97 118 C112 121 128 124 143 127" strokeWidth={2.6} opacity={0.7} />

      {/* A mark, circled twice the way a pen doubles back */}
      <path
        d="M116 150 C104 147 94 154 93 165 C92 176 101 184 113 185
           C126 186 135 178 135 167 C135 156 126 149 115 148"
        strokeWidth={3.4}
      />
      <path
        d="M114 145 C100 145 90 153 90 165 C90 175 97 182 107 185"
        strokeWidth={2.4}
        opacity={0.55}
      />
      <path d="M105 166 C108 169 110 172 112 174 C116 168 121 161 126 155" strokeWidth={3.2} />

      {/* Pencil laid across the corner, sharpened to a point */}
      <path
        d="M160 170 C175 162 190 153 205 145 C208 150 211 155 214 160
           C199 168 184 177 169 185 C166 180 163 175 160 170 Z"
        fill="white"
        strokeWidth={3.2}
      />
      {/* Sharpened tip, converging just past the shaft */}
      <path
        d="M205 145 C210 149 212 154 214 160 C220 156 226 152 231 148
           C223 147 214 146 205 145 Z"
        fill="white"
        strokeWidth={3}
      />
      {/* Graphite nib */}
      <path d="M225 151 C227 150 229 149 231 148 C228 148 226 147 224 147 Z" fill="currentColor" strokeWidth={2} />
      {/* Ferrule band at the blunt end */}
      <path d="M164 176 C169 173 173 170 178 167" strokeWidth={2.4} opacity={0.6} />
    </g>
  </svg>
);
