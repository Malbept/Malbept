// admin.js
import { database } from './firebase.js';
import { ref, set, get, update } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js';
import { getTranslation } from './translations.js';
import { gameState, loadGameState, updateUI } from './game.js';

const ADMIN_IDS = ['5678878569']; // Замени на свой Telegram ID

export function initializeAdmin() {
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  const addTaskSection = document.getElementById('add-task-section');
  const addPromoSection = document.getElementById('add-promo-section');

  if (userId && ADMIN_IDS.includes(userId.toString())) {
    if (addTaskSection) addTaskSection.style.display = 'block';
    if (addPromoSection) addPromoSection.style.display = 'block';
  }

  const addTaskButton = document.getElementById('add-task-button');
  if (addTaskButton) {
    addTaskButton.addEventListener('click', addTask);
  }

  const redeemPromoButton = document.getElementById('redeem-promo-button');
  if (redeemPromoButton) {
    redeemPromoButton.addEventListener('click', redeemPromoCode);
  }

  const addPromoButton = document.getElementById('add-promo-button');
  if (addPromoButton) {
    addPromoButton.addEventListener('click', addPromoCode);
  }
}

async function addTask() {
  const description = document.getElementById('new-task-description').value;
  const target = parseInt(document.getElementById('new-task-target').value);
  const reward = parseInt(document.getElementById('new-task-reward').value);
  const type = document.getElementById('new-task-type').value;
  const url = document.getElementById('new-task-url').value;
  const expires = document.getElementById('new-task-expires').value;

  if (!description || !target || !reward || !type) {
    alert(getTranslation('fill_all_fields'));
    return;
  }

  const taskId = Date.now().toString();
  const task = {
    description,
    target,
    reward,
    type,
    url: url || null,
    expires: expires || null,
    level: 1,
    createdAt: Date.now()
  };

  try {
    await set(ref(database, 'tasks/' + taskId), task);
    alert(getTranslation('task_added'));
    gameState.tasks.push({ id: taskId, ...task, progress: 0, completed: false });
    updateTasks();
    document.getElementById('new-task-description').value = '';
    document.getElementById('new-task-target').value = '';
    document.getElementById('new-task-reward').value = '';
    document.getElementById('new-task-url').value = '';
    document.getElementById('new-task-expires').value = '';
  } catch (error) {
    console.error('Error adding task:', error);
    alert(getTranslation('error_adding_task'));
  }
}

async function addPromoCode() {
  const code = document.getElementById('new-promo-code').value;
  const reward = parseInt(document.getElementById('new-promo-reward').value);
  const maxUses = parseInt(document.getElementById('new-promo-uses').value);
  const expires = document.getElementById('new-promo-expires').value;

  if (!code || !reward) {
    alert(getTranslation('fill_all_fields'));
    return;
  }

  const promo = {
    code,
    reward,
    maxUses: maxUses || -1,
    uses: 0,
    expires: expires || null,
    createdAt: Date.now()
  };

  try {
    await set(ref(database, 'promocodes/' + code), promo);
    alert(getTranslation('promo_added'));
    document.getElementById('new-promo-code').value = '';
    document.getElementById('new-promo-reward').value = '';
    document.getElementById('new-promo-uses').value = '';
    document.getElementById('new-promo-expires').value = '';
  } catch (error) {
    console.error('Error adding promo code:', error);
    alert(getTranslation('error_adding_promo'));
  }
}

async function redeemPromoCode() {
  const code = document.getElementById('promo-code-input').value;
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  if (!code) {
    alert(getTranslation('enter_promo_code'));
    return;
  }

  if (!userId) {
    alert(getTranslation('no_user_id'));
    return;
  }

  try {
    const promoRef = ref(database, 'promocodes/' + code);
    const snapshot = await get(promoRef);
    if (!snapshot.exists()) {
      alert(getTranslation('invalid_promo_code'));
      return;
    }

    const promo = snapshot.val();
    const userPromoRef = ref(database, `players/${userId}/promocodes/${code}`);
    const userSnapshot = await get(userPromoRef);

    if (userSnapshot.exists()) {
      alert(getTranslation('promo_already_used'));
      return;
    }

    if (promo.maxUses !== -1 && promo.uses >= promo.maxUses) {
      alert(getTranslation('promo_limit_reached'));
      return;
    }

    if (promo.expires && new Date(promo.expires) < new Date()) {
      alert(getTranslation('promo_expired'));
      return;
    }

    gameState.score += promo.reward;
    await update(ref(database, 'promocodes/' + code), { uses: promo.uses + 1 });
    await set(userPromoRef, { redeemedAt: Date.now() });
    saveGameState();
    updateUI();
    alert(`${getTranslation('promo_redeemed')} ${promo.reward}P`);
    document.getElementById('promo-code-input').value = '';
  } catch (error) {
    console.error('Error redeeming promo code:', error);
    alert(getTranslation('error_redeeming_promo'));
  }
}

async function claimTask(taskId) {
  const task = gameState.tasks.find(t => t.id === taskId);
  if (!task || task.claimed) return;

  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  if (!userId) {
    alert(getTranslation('no_user_id'));
    return;
  }

  try {
    task.claimed = true;
    gameState.score += task.reward;
    await update(ref(database, 'players/' + userId + '/tasks/' + taskId), { claimed: true });
    saveGameState();
    updateTasks();
    updateUI();
    alert(`${getTranslation('task_completed')} ${task.reward}P`);
  } catch (error) {
    console.error('Error claiming task:', error);
    alert(getTranslation('error_claiming_task'));
  }
}

document.addEventListener('DOMContentLoaded', initializeAdmin);