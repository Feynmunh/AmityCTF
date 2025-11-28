import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

if (!serviceAccountRaw) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT_KEY. Provide your service account JSON via this env var.")
  process.exit(1)
}

let serviceAccount

try {
  serviceAccount = JSON.parse(serviceAccountRaw)
} catch (error) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY must be valid JSON:", error)
  process.exit(1)
}

if (!serviceAccount.project_id) {
  console.error("Service account JSON is missing the project_id field. Check your credentials.")
  process.exit(1)
}

initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id,
})

const db = getFirestore()

const defaultChallenges = [
  {
    id: "challenge-1",
    title: "Challenge 1",
    prompt:
      "Decode the disguised signal embedded in the mission briefing. Submit the flag with the format FLAG{hash}.",
    difficulty: "easy",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
]

async function seedChallenges() {
  const batch = db.batch()

  defaultChallenges.forEach(({ id, ...data }) => {
    const ref = db.collection("challenges").doc(id)
    batch.set(ref, data, { merge: true })
  })

  await batch.commit()
  console.log(`Seeded ${defaultChallenges.length} document(s) into the 'challenges' collection.`)
}

seedChallenges()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to seed challenges:", error)
    process.exit(1)
  })
