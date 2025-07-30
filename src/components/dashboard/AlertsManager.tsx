import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function AlertsManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Alert</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="alert-name">Alert Name</Label>
                <Input id="alert-name" />
              </div>
              {/* Add more filter options here */}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
