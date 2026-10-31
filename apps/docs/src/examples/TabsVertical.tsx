// @example Vertical, for a settings page
import { Card, TabsContent, TabsList, TabsRoot, TabsTrigger, Text } from 'pane-react';

export default function TabsVertical() {
  return (
    <Card as="div" className="demo-card demo-wide">
    <TabsRoot defaultValue="profile" orientation="vertical">
      <TabsList aria-label="Settings"><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="shop">Shop</TabsTrigger><TabsTrigger value="billing" disabled>Billing</TabsTrigger></TabsList>
      <TabsContent value="profile"><Text as="p">Your name and photo.</Text></TabsContent>
      <TabsContent value="shop"><Text as="p">Your shop name and address.</Text></TabsContent>
    </TabsRoot>
    </Card>
  );
}
