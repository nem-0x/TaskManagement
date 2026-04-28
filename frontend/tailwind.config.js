/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'board-bg':        '#1d4e89',
        'header-bg':       '#0052cc',
        'col-bg':          '#ebecf0',
        'col-title':       '#172b4d',
        'meta-text':       '#5e6c84',
        'priority-high':   '#e53935',
        'priority-medium': '#fb8c00',
        'priority-low':    '#43a047',
        'due-overdue':     '#e53935',
        'due-soon':        '#fb8c00',
      },
    },
  },
  plugins: [],
}

