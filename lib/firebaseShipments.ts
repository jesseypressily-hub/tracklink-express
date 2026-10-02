import { db } from "@/lib/firebaseAdmin";

export type FirebaseShipment = {
  id: string;

  // Tracking
  trackingNumber: string;
  currentStatus: string;
  estimatedDelivery?: string;

  // Latest customer-facing update
  latestUpdateDescription?: string;
  exceptionReason?: string;
  customerInstruction?: string;
  lastUpdatedAt?: string;

  // Sender
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  senderAddress: string;

  // Recipient
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientAddress: string;

  createdAt: string;

  // Locations
  origin: string;
  destination: string;

  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;

  currentLat: number;
  currentLng: number;

  // Package
  serviceType: string;
  packageType: string;
  weight: number;
  numberOfPackages: number;

  // Charges
  currency: string;
  shippingCost?: number;
  otherFees?: number;
  totalAmount?: number;

  // Backward compatibility
  customerName?: string;
};

export type TrackingHistoryEvent = {
  id: string;
  shipmentId: string;
  status: string;
  location: string;
  description: string;
  createdAt: string;

  // Optional professional tracking information
  estimatedDelivery?: string;
  exceptionReason?: string;
  customerInstruction?: string;

  currentLat?: number | null;
  currentLng?: number | null;
};

export async function getShipments() {
  const snapshot = await db
    .collection("shipments")
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();

      return dateB - dateA;
    });
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
  const doc = await db
    .collection("shipments")
    .doc(id)
    .get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    id: doc.id,

    // Tracking
    trackingNumber: data?.trackingNumber,
    currentStatus: data?.currentStatus,
    createdAt: data?.createdAt,
    estimatedDelivery: data?.estimatedDelivery,

    latestUpdateDescription:
      data?.latestUpdateDescription,

    exceptionReason:
      data?.exceptionReason,

    customerInstruction:
      data?.customerInstruction,

    lastUpdatedAt:
      data?.lastUpdatedAt,

    // Sender
    senderName: data?.senderName,
    senderEmail: data?.senderEmail,
    senderPhone: data?.senderPhone,
    senderAddress: data?.senderAddress,

    // Recipient
    recipientName: data?.recipientName,
    recipientEmail: data?.recipientEmail,
    recipientPhone: data?.recipientPhone,
    recipientAddress: data?.recipientAddress,

    // Locations
    origin: data?.origin,
    destination: data?.destination,

    originLat: data?.originLat,
    originLng: data?.originLng,
    destinationLat: data?.destinationLat,
    destinationLng: data?.destinationLng,

    currentLat: data?.currentLat,
    currentLng: data?.currentLng,

    // Package
    serviceType: data?.serviceType,
    packageType: data?.packageType,
    weight: data?.weight,
    numberOfPackages: data?.numberOfPackages,

    // Charges
    currency: data?.currency || "GBP",
    shippingCost: data?.shippingCost,
    otherFees: data?.otherFees,
    totalAmount: data?.totalAmount,

    // Keep older shipments working
    customerName: data?.customerName,
  };
}

export async function createShipment(data: {
  trackingNumber: string;

  // Sender
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  senderAddress: string;

  // Recipient
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientAddress: string;

  createdAt: string;

  // Locations
  origin: string;
  destination: string;

  currentStatus: string;
  currency: string;

  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;

  currentLat: number;
  currentLng: number;

  // Package
  serviceType: string;
  packageType: string;
  weight: number;
  numberOfPackages: number;

  // Optional
  estimatedDelivery?: string;
  shippingCost?: number;
  otherFees?: number;
  totalAmount?: number;
  
}) {
  const shipmentRef = await db
    .collection("shipments")
    .add({
      trackingNumber: data.trackingNumber,

      // Backward compatibility
      customerName: data.senderName,

      // Sender
      senderName: data.senderName,
      senderEmail: data.senderEmail,
      senderPhone: data.senderPhone,
      senderAddress: data.senderAddress,

      // Recipient
      recipientName: data.recipientName,
      recipientEmail: data.recipientEmail,
      recipientPhone: data.recipientPhone,
      recipientAddress: data.recipientAddress,

      // Locations
      origin: data.origin,
      destination: data.destination,

  
      // Status
      currentStatus: data.currentStatus,
      currency: data.currency || "GBP",

      // Coordinates
      originLat: data.originLat,
      originLng: data.originLng,
      destinationLat: data.destinationLat,
      destinationLng: data.destinationLng,

      currentLat: data.currentLat,
      currentLng: data.currentLng,

      // Package
      serviceType: data.serviceType,
      packageType: data.packageType,
      weight: data.weight,
      numberOfPackages: data.numberOfPackages,

      // Optional
      estimatedDelivery:
        data.estimatedDelivery || null,

      shippingCost:
        data.shippingCost ?? null,

      otherFees:
        data.otherFees ?? null,

      totalAmount:
        data.totalAmount ?? null,

      // New update fields
      latestUpdateDescription: null,
      exceptionReason: null,
      customerInstruction: null,
      lastUpdatedAt: data.createdAt,

      createdAt: data.createdAt,
    });

  return shipmentRef.id;
}

export async function updateShipment(
  id: string,
  data: {
    currentStatus: string;

    currentLat?: number;
    currentLng?: number;

    estimatedDelivery?: string | null;

    latestUpdateDescription?: string | null;

    exceptionReason?: string | null;

    customerInstruction?: string | null;

    lastUpdatedAt?: string;
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

  if (data.estimatedDelivery !== undefined) {
    updateData.estimatedDelivery =
      data.estimatedDelivery;
  }

  if (
    data.latestUpdateDescription !== undefined
  ) {
    updateData.latestUpdateDescription =
      data.latestUpdateDescription;
  }

  if (data.exceptionReason !== undefined) {
    updateData.exceptionReason =
      data.exceptionReason;
  }

  if (data.customerInstruction !== undefined) {
    updateData.customerInstruction =
      data.customerInstruction;
  }

  if (data.lastUpdatedAt !== undefined) {
    updateData.lastUpdatedAt =
      data.lastUpdatedAt;
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
  createdAt?: string;

  // Optional professional tracking information
  estimatedDelivery?: string;
  exceptionReason?: string;
  customerInstruction?: string;

  currentLat?: number | null;
  currentLng?: number | null;
}) {
  const historyRef = await db
    .collection("tracking_history")
    .add({
      shipmentId: data.shipmentId,
      status: data.status,
      location: data.location,
      description: data.description,

      createdAt:
        data.createdAt ||
        new Date().toISOString(),

      estimatedDelivery:
        data.estimatedDelivery || null,

      exceptionReason:
        data.exceptionReason || null,

      customerInstruction:
        data.customerInstruction || null,

      currentLat:
        data.currentLat ?? null,

      currentLng:
        data.currentLng ?? null,
    });

  return historyRef.id;
}

export async function getTrackingHistory(
  shipmentId: string
): Promise<TrackingHistoryEvent[]> {
  const snapshot = await db
    .collection("tracking_history")
    .where("shipmentId", "==", shipmentId)
    .get();

  return snapshot.docs
    .map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        shipmentId: data.shipmentId,
        status: data.status,
        location: data.location,
        description: data.description,
        createdAt: data.createdAt,

        estimatedDelivery:
          data.estimatedDelivery,

        exceptionReason:
          data.exceptionReason,

        customerInstruction:
          data.customerInstruction,

        currentLat:
          data.currentLat ?? null,

        currentLng:
          data.currentLng ?? null,
      };
    })
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
}

export async function deleteShipment(
  id: string
) {
  const shipmentRef = db
    .collection("shipments")
    .doc(id);

  const historySnapshot = await db
    .collection("tracking_history")
    .where("shipmentId", "==", id)
    .get();

  const batch = db.batch();

  historySnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.delete(shipmentRef);

  await batch.commit();
}