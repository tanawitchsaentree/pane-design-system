'use client';

import { Button, FormField, Textarea } from 'dial-react';

export function BasicTextarea() {
  return <Textarea defaultValue="" placeholder="Tell us about yourself" rows={3} />;
}

export function TextareaResizeOptions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-inline-sm)' }}>
      <Textarea resize="none" placeholder="resize: none" />
      <Textarea resize="vertical" placeholder="resize: vertical" />
      <Textarea resize="both" placeholder="resize: both" />
    </div>
  );
}

export function InvalidTextarea() {
  return <Textarea invalid defaultValue="too short" aria-label="Bio" />;
}

export function TextareaSizeLadder() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-inline-sm)' }}>
      <Textarea size="sm" placeholder="size: sm" aria-label="size sm" />
      <Textarea size="md" placeholder="size: md (default)" aria-label="size md" />
      <Textarea size="lg" placeholder="size: lg" aria-label="size lg" />
      <Textarea size="xl" placeholder="size: xl" aria-label="size xl" />
    </div>
  );
}

export function TextareaInFormField() {
  return (
    <FormField label="Bio" helperText="Shown on your public profile.">
      <Textarea placeholder="Tell us about yourself" rows={3} />
    </FormField>
  );
}

export function TextareaCommentForm() {
  return (
    <form
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}
      onSubmit={(e) => e.preventDefault()}
    >
      <FormField label="Comment" required helperText="Be specific and constructive.">
        <Textarea placeholder="Leave a comment" rows={4} resize="vertical" />
      </FormField>
      <Button type="submit" style={{ alignSelf: 'flex-end' }}>
        Post comment
      </Button>
    </form>
  );
}
