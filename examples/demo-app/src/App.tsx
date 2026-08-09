import { useState } from 'react';
import {
  Container,
  Stack,
  Flex,
  Heading,
  Text,
  Divider,
  FormField,
  Input,
  Textarea,
  Switch,
  Button,
  RadioCards,
  Rating,
  Listbox,
  Dialog,
  ToastProvider,
  useToast,
} from '@dial/react';
import type { Key } from '@dial/react';

/**
 * A Settings page — the ORDERS B2 exercise: build one real page combining form + dialog + toast +
 * list using the actual workspace package (not a hand-picked "does this component work in
 * isolation" story), and note whatever felt missing or awkward along the way rather than quietly
 * working around it. Every gap below is a real thing this build hit, not a hypothetical.
 */
function SettingsPage() {
  const { toast } = useToast();
  const [plan, setPlan] = useState('pro');
  const [rating, setRating] = useState(0);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<ReadonlySet<Key>>(new Set(['en']));

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast({ title: 'Settings saved', description: 'Your changes have been applied.', variant: 'success' });
  }

  return (
    <Container>
      <Stack gap="700">
        <Stack gap="100">
          <Heading level={1}>Account settings</Heading>
          <Text color="subtle">A demo page combining form, selection, dialog, and toast — every component here is real, not a mockup.</Text>
        </Stack>

        {/*
          GAP #1: there is no <Card> yet (planned for v0.2/M-tier per the roadmap) — every section
          below is separated with plain Stack + Divider instead of a bordered/elevated container.
          It reads fine here, but a real settings page usually wants visual grouping stronger than
          a horizontal rule, and every consumer will reach for this before it exists.
        */}
        <form onSubmit={handleSave}>
          <Stack gap="600">
            <Stack gap="400">
              <Heading level={2}>Profile</Heading>
              <FormField label="Full name" required>
                <Input placeholder="Jane Doe" defaultValue="Jane Doe" />
              </FormField>
              <FormField label="Email" required helperText="We'll only use this for account notices.">
                <Input type="email" placeholder="jane@example.com" defaultValue="jane@example.com" />
              </FormField>
              <FormField label="Bio" helperText="Shown on your public profile.">
                <Textarea placeholder="Tell us about yourself" rows={3} />
              </FormField>
            </Stack>

            <Divider />

            <Stack gap="400">
              <Heading level={2}>Plan</Heading>
              {/*
                GAP #2: RadioCards has no built-in "badge"/"recommended" slot — the "Recommended"
                text below is just plain text inside the card's children, which works because
                RadioCards.Item accepts arbitrary ReactNode, but there's no dedicated visual
                treatment for it the way many pricing-card patterns expect (a corner ribbon, a
                highlighted border color distinct from the selected-state border). Not broken,
                just a "you'll have to design this yourself" gap worth knowing about upfront.
              */}
              <RadioCards name="plan" value={plan} onChange={setPlan} aria-label="Choose a plan" orientation="horizontal">
                <RadioCards.Item value="free">
                  <Stack gap="100">
                    <Text weight="semibold">Free</Text>
                    <Text size="sm" color="subtle">Basic features</Text>
                  </Stack>
                </RadioCards.Item>
                <RadioCards.Item value="pro">
                  <Stack gap="100">
                    <Text weight="semibold">Pro</Text>
                    <Text size="sm" color="subtle">Recommended — everything in Free, plus priority support</Text>
                  </Stack>
                </RadioCards.Item>
                <RadioCards.Item value="team">
                  <Stack gap="100">
                    <Text weight="semibold">Team</Text>
                    <Text size="sm" color="subtle">Seats for your whole org</Text>
                  </Stack>
                </RadioCards.Item>
              </RadioCards>
            </Stack>

            <Divider />

            <Stack gap="400">
              <Heading level={2}>Preferred languages</Heading>
              {/*
                GAP #3: this is exactly the "choose from a list" shape a settings page wants for
                something like language/region — but Listbox is the only Selection-family
                component available in v0.1. A real settings page would usually want this as a
                closed dropdown (Select) rather than an always-open list taking up permanent
                vertical space — Select is still in progress (see roadmap), so Listbox is being
                used here as the only available substitute. It works, but it's visibly not the
                right widget for this particular spot.
              */}
              <FormField label="Languages you're comfortable working in">
                <Listbox
                  aria-label="Preferred languages"
                  selectionMode="multiple"
                  selectedKeys={selectedLanguages}
                  onSelectionChange={setSelectedLanguages}
                >
                  <Listbox.Item key="en">English</Listbox.Item>
                  <Listbox.Item key="th">Thai</Listbox.Item>
                  <Listbox.Item key="es">Spanish</Listbox.Item>
                  <Listbox.Item key="ja">Japanese</Listbox.Item>
                </Listbox>
              </FormField>
            </Stack>

            <Divider />

            <Stack gap="400">
              <Heading level={2}>Notifications</Heading>
              <Flex justify="between" align="center">
                <Stack gap="0">
                  <Text weight="medium">Email notifications</Text>
                  <Text size="sm" color="subtle">Get updates about your account via email</Text>
                </Stack>
                <Switch checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} aria-label="Email notifications" />
              </Flex>
              <Flex justify="between" align="center">
                <Stack gap="0">
                  <Text weight="medium">SMS notifications</Text>
                  <Text size="sm" color="subtle">Get updates about your account via text message</Text>
                </Stack>
                <Switch checked={notifySms} onChange={(e) => setNotifySms(e.target.checked)} aria-label="SMS notifications" />
              </Flex>
            </Stack>

            <Divider />

            <Stack gap="400">
              <Heading level={2}>How's your experience been?</Heading>
              <Rating name="experience-rating" value={rating} onChange={setRating} aria-label="Rate your experience" />
            </Stack>

            <Divider />

            <Flex justify="between">
              <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
                <Dialog.Trigger asChild>
                  <Button type="button" variant="outline" intent="danger">
                    Delete account
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Title>Delete your account?</Dialog.Title>
                  <Dialog.Description>
                    This permanently deletes your account and all associated data. This cannot be undone.
                  </Dialog.Description>
                  <Flex gap="200" justify="end">
                    <Dialog.Close asChild>
                      <Button type="button" variant="ghost">Cancel</Button>
                    </Dialog.Close>
                    <Button
                      type="button"
                      intent="danger"
                      onClick={() => {
                        setConfirmOpen(false);
                        toast({ title: 'Account deleted', variant: 'default' });
                      }}
                    >
                      Delete account
                    </Button>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>

              <Button type="submit" intent="primary">Save changes</Button>
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}

export function App() {
  return (
    <ToastProvider>
      <SettingsPage />
    </ToastProvider>
  );
}
