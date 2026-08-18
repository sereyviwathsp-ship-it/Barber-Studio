import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore'
import { db } from './config'

export async function loadQuestions() {
  const snap = await getDocs(query(collection(db, 'questions'), orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function submitQuestion(user, text) {
  const payload = {
    userId: user.uid,
    name: user.name,
    text,
    answer: null,
    createdAt: new Date().toISOString(),
  }
  const docRef = await addDoc(collection(db, 'questions'), payload)
  return { id: docRef.id, ...payload }
}

/** Admin-only: attach a public answer to a question. */
export async function answerQuestion(questionId, answer) {
  await updateDoc(doc(db, 'questions', questionId), { answer })
}
