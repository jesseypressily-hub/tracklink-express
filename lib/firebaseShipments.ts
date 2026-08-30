import { db } from "@/lib/firebaseAdmin";

export type FirebaseShipment = {
  id: string;
  trackingNumber: string;
  customerName: string;
  origin: string;
  destination: string;
  currentStatus: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  currentLat: number;
  currentLng: number;
  createdAt: string;
};

export async function getShipments() {
  const snapshot = await db
    .collection("shipments")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getShipmentByTrackingNumber(
  trackingNumber: string
) {
  const snapshot = await db
    .collection("shipments")
    .where("trackingNumber", "==", trackingNumber)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  };
}

export async function getShipmentById(id: string) {
  const doc = await db.collection("shipments").doc(id).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    id: doc.id,
    trackingNumber: data?.trackingNumber,
    customerName: data?.customerName,
    origin: data?.origin,
    destination: data?.destination,
    currentStatus: data?.currentStatus,
    originLat: data?.originLat,
    originLng: data?.originLng,
    destinationLat: data?.destinationLat,
    destinationLng: data?.destinationLng,
    currentLat: data?.currentLat,
    currentLng: data?.currentLng,
    createdAt: data?.createdAt,
  };
}

export async function createShipment(data: {
  trackingNumber: string;
  customerName: string;
  origin: string;
  destination: string;
  currentStatus: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  currentLat: number;
  currentLng: number;
}) {
  const shipmentRef = await db.collection("shipments").add({
    trackingNumber: data.trackingNumber,
    customerName: data.customerName,
    origin: data.origin,
    destination: data.destination,
    currentStatus: data.currentStatus,
    originLat: data.originLat,
    originLng: data.originLng,
    destinationLat: data.destinationLat,
    destinationLng: data.destinationLng,
    currentLat: data.currentLat,
    currentLng: data.currentLng,
    createdAt: new Date().toISOString(),
  });

  return shipmentRef.id;
}

export async function updateShipment(
  id: string,
  data: {
    currentStatus: string;
    currentLat?: number;
    currentLng?: number;
  }
) {
  const updateData: Record<string, unknown> = {
    currentStatus: data.currentStatus,
  };

  if (data.currentLat !== undefined) {
    updateData.currentLat = data.currentLat;
  }

  if (data.currentLng !== undefined) {
    updateData.currentLng = data.currentLng;
  }

  await db
    .collection("shipments")
    .doc(id)
    .update(updateData);
}

export async function addTrackingHistory(data: {
  shipmentId: string;
  status: string;
  location: string;
  description: string;
}) {
  const historyRef = await db
    .collection("tracking_history")
    .add({
      shipmentId: data.shipmentId,
      status: data.status,
      location: data.location,
      description: data.description,
      createdAt: new Date().toISOString(),
    });

  return historyRef.id;
}

export async function getTrackingHistory(
  shipmentId: string
) {
  const snapshot = await db
    .collection("tracking_history")
    .where("shipmentId", "==", shipmentId)
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
}