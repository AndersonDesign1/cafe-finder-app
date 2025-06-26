import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { DatePicker } from "../components/ui/date-picker"; // shadcn date picker
import { MotionDiv, MotionButton } from "../components/ui/motion";
import { useToast } from "../hooks/use-toast";
import type { Cafe } from "../types/cafe";
import { format, addDays } from "date-fns";

type TimeSlot = {
  time: string;
  available: boolean;
  price: number;
  type: "regular" | "premium" | "meeting";
};
type BookingStep = "datetime" | "details" | "payment" | "confirmation";

const tableTypes = [
  { id: "individual", name: "Individual Workspace", capacity: 1, price: 0 },
  { id: "shared", name: "Shared Table", capacity: 4, price: 5 },
  { id: "private", name: "Private Booth", capacity: 2, price: 10 },
  { id: "meeting", name: "Meeting Room", capacity: 8, price: 25 },
  { id: "event", name: "Event Space", capacity: 20, price: 50 },
];

const generateTimeSlots = () => {
  const slots: TimeSlot[] = [];
  for (let h = 8; h < 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      const time = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      const isPremium = h >= 12 && h <= 14;
      const isMeeting = h >= 9 && h <= 17;
      slots.push({
        time,
        available: Math.random() > 0.3,
        price: isPremium ? 15 : isMeeting ? 10 : 5,
        type: isPremium ? "premium" : isMeeting ? "meeting" : "regular",
      });
    }
  }
  return slots;
};

export function BookingSystem({ cafe }: { cafe: Cafe }) {
  const { toast } = useToast();
  const [step, setStep] = useState<BookingStep>("datetime");
  const [date, setDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    date: "",
    timeSlot: "",
    duration: 2,
    guests: 1,
    tableType: "individual",
    specialRequests: "",
    contact: { name: "", email: "", phone: "" },
  });

  const minDate = new Date();
  const maxDate = addDays(new Date(), 30);

  const total = () => {
    const t = tableTypes.find((t) => t.id === data.tableType);
    return ((slot?.price || 0) + (t?.price || 0)) * data.duration;
  };

  const submit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setStep("confirmation");
    setLoading(false);
    toast({
      title: "Booking Confirmed! 🎉",
      description: `Your table at ${cafe.name} has been reserved for ${data.date} at ${data.timeSlot}.`,
    });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Reserve Your Spot
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Book your perfect workspace at {cafe.name}
        </p>
      </CardHeader>
      <CardContent>
        {step === "datetime" && (
          <div className="space-y-6">
            <div>
              <Label>Select Date</Label>
              <DatePicker
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setData((prev) => ({
                    ...prev,
                    date: d ? format(d, "yyyy-MM-dd") : "",
                  }));
                  setSlots(d ? generateTimeSlots() : []);
                  setSlot(null);
                }}
                minDate={minDate}
                maxDate={maxDate}
                className="w-full"
                placeholder="Pick a date"
              />
            </div>
            {slots.length > 0 && (
              <div>
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {slots.map((s) => (
                    <MotionButton
                      key={s.time}
                      whileHover={s.available ? { scale: 1.02 } : {}}
                      whileTap={s.available ? { scale: 0.98 } : {}}
                    >
                      <Button
                        variant={slot?.time === s.time ? "default" : "outline"}
                        size="sm"
                        disabled={!s.available}
                        onClick={() => {
                          if (!s.available) return;
                          setSlot(s);
                          setData((d) => ({ ...d, timeSlot: s.time }));
                        }}
                        className={`w-full text-xs ${
                          !s.available ? "opacity-50" : ""
                        }`}
                      >
                        <div className="text-center">
                          <div>{s.time}</div>
                          <div className="text-xs opacity-75">${s.price}</div>
                        </div>
                      </Button>
                    </MotionButton>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Prices shown are per hour. Premium rates apply during peak
                  hours.
                </p>
              </div>
            )}
            {slot && (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Selected Time</p>
                        <p className="text-sm text-muted-foreground">
                          {date ? format(date, "yyyy-MM-dd") : ""} at{" "}
                          {slot.time}
                        </p>
                      </div>
                      <Badge
                        className={
                          slot.type === "premium"
                            ? "bg-yellow-500"
                            : slot.type === "meeting"
                            ? "bg-blue-500"
                            : "bg-green-500" + " text-white"
                        }
                      >
                        {slot.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </MotionDiv>
            )}
            <Button
              onClick={() => setStep("details")}
              disabled={!slot}
              className="w-full cafe-button"
              size="lg"
            >
              Continue to Details
            </Button>
          </div>
        )}

        {step === "details" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Duration (hours)</Label>
                <Select
                  value={data.duration.toString()}
                  onValueChange={(v) =>
                    setData((d) => ({ ...d, duration: parseInt(v) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 8].map((h) => (
                      <SelectItem key={h} value={h.toString()}>
                        {h} hour{h > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Number of Guests</Label>
                <Select
                  value={data.guests.toString()}
                  onValueChange={(v) =>
                    setData((d) => ({ ...d, guests: parseInt(v) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                      <SelectItem key={g} value={g.toString()}>
                        {g} guest{g > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Table Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tableTypes.map((table) => (
                  <MotionDiv
                    key={table.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all ${
                        data.tableType === table.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() =>
                        setData((d) => ({ ...d, tableType: table.id }))
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{table.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Up to {table.capacity} people
                            </p>
                          </div>
                          <Badge variant="outline">+${table.price}/hr</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </MotionDiv>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Label>Contact Information</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your full name"
                  value={data.contact.name}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      contact: { ...d.contact, name: e.target.value },
                    }))
                  }
                />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={data.contact.email}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      contact: { ...d.contact, email: e.target.value },
                    }))
                  }
                />
              </div>
              <Input
                placeholder="+1 (555) 123-4567"
                value={data.contact.phone}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    contact: { ...d.contact, phone: e.target.value },
                  }))
                }
              />
            </div>
            <Textarea
              placeholder="Any special requirements or requests..."
              value={data.specialRequests}
              onChange={(e) =>
                setData((d) => ({ ...d, specialRequests: e.target.value }))
              }
              rows={3}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("datetime")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep("payment")}
                className="flex-1 cafe-button"
                disabled={!data.contact.name || !data.contact.email}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span className="font-medium">
                    {data.date} at {data.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{data.duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span className="font-medium">{data.guests} people</span>
                </div>
                <div className="flex justify-between">
                  <span>Table Type:</span>
                  <span className="font-medium">
                    {tableTypes.find((t) => t.id === data.tableType)?.name}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${total()}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    This is a demo. No actual payment will be processed.
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value="4242 4242 4242 4242"
                    disabled
                  />
                  <Input placeholder="MM/YY" value="12/25" disabled />
                  <Input placeholder="123" value="123" disabled />
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("details")}
                className="flex-1"
              >
                Back
              </Button>
              <MotionButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  onClick={submit}
                  disabled={loading}
                  className="w-full cafe-button"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Booking (${total()})
                    </>
                  )}
                </Button>
              </MotionButton>
            </div>
          </div>
        )}

        {step === "confirmation" && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-muted-foreground">
                Your reservation has been successfully created.
              </p>
            </div>
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-6">
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{cafe.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span>
                      {data.date} at {data.timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>{data.duration} hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span>{data.guests} guests</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to {data.contact.email}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  Add to Calendar
                </Button>
                <Button className="flex-1 cafe-button">
                  View Booking Details
                </Button>
              </div>
            </div>
          </MotionDiv>
        )}
      </CardContent>
    </Card>
  );
}
