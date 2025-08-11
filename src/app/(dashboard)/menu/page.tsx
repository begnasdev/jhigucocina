"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const tableId = searchParams.get("tableId");

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Menu</CardTitle>
        </CardHeader>
        <CardContent>
          {restaurantId && tableId ? (
            <div>
              <p>
                Welcome to Restaurant ID:{" "}
                <span className="font-bold">{restaurantId}</span>
              </p>
              <p>
                You are at Table ID: <span className="font-bold">{tableId}</span>
              </p>
              {/* Add your menu items here */}
            </div>
          ) : (
            <p>
              Scanning information not found. Please scan a valid QR code.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
