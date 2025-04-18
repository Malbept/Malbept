// api.js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9IcxBF6Z5CbjkDF4X4qiFyidPDBZAVASZrLBsDYEWSj63BR9Bnf0SIpdzu52BuTxG/exec";

const api = {
  async fetchLeaderboard() {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getLeaderboard`);
      if (!response.ok) throw new Error('Error loading leaderboard');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },

  async saveScore(id, name, score) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=updateScore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name, score }),
      });
      if (!response.ok) throw new Error('Error saving score');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return { success: false };
    }
  },
};