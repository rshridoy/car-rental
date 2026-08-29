import { Car, Heart, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLOR_TOKENS: { name: string; className: string }[] = [
  { name: "background", className: "bg-background border border-border" },
  { name: "foreground", className: "bg-foreground" },
  { name: "card", className: "bg-card border border-border" },
  { name: "primary", className: "bg-primary" },
  { name: "secondary", className: "bg-secondary" },
  { name: "muted", className: "bg-muted" },
  { name: "accent", className: "bg-accent" },
  { name: "navy", className: "bg-navy" },
  { name: "success", className: "bg-success" },
  { name: "destructive", className: "bg-destructive" },
  { name: "info", className: "bg-info" },
  { name: "surface-muted", className: "bg-surface-muted border border-border" },
  { name: "page", className: "bg-page border border-border" },
  { name: "border", className: "bg-border" },
  { name: "line-strong", className: "bg-line-strong" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
      <div>
        <p className="text-sm font-medium text-primary">Best Auto</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Style Guide</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Design tokens, typography and component states for the landing page and dashboard, so
          the build can be diffed against the Figma wireframe and build prompt.
        </p>
      </div>

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COLOR_TOKENS.map((token) => (
            <div key={token.name} className="flex flex-col gap-2">
              <div className={`h-16 w-full rounded-xl ${token.className}`} />
              <p className="font-mono text-xs text-muted-foreground">{token.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-3">
          <p className="text-5xl font-extrabold tracking-tight text-foreground">Heading / 5xl bold</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">Heading / 3xl bold</p>
          <p className="text-xl font-semibold text-foreground">Heading / xl semibold</p>
          <p className="text-base text-foreground">Body / base regular</p>
          <p className="text-sm text-muted-foreground">Body / sm muted</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Label / xs uppercase</p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Search">
            <Search />
          </Button>
        </div>
      </Section>

      <Section title="Badges & status">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge className="border-transparent bg-success/10 text-success">Success</Badge>
          <Badge className="border-transparent bg-destructive/10 text-destructive">Cancelled</Badge>
          <Badge className="border-transparent bg-info/10 text-info">Pending</Badge>
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="popular">
          <TabsList variant="line" className="gap-8 border-b border-border group-data-horizontal/tabs:h-auto">
            <TabsTrigger value="popular" className="rounded-none px-1 pb-3 data-active:bg-transparent data-active:after:bg-primary">
              Popular
            </TabsTrigger>
            <TabsTrigger value="large" className="rounded-none px-1 pb-3 data-active:bg-transparent data-active:after:bg-primary">
              Large Car
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Section>

      <Section title="Form controls">
        <div className="flex max-w-sm flex-col gap-4">
          <Input placeholder="Select your city" />
          <RadioGroup defaultValue="pickup" className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="pickup" /> Pick - Up
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="dropoff" /> Drop - Off
            </label>
          </RadioGroup>
        </div>
      </Section>

      <Section title="Avatar">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>MW</AvatarFallback>
          </Avatar>
          <Avatar className="h-12 w-12">
            <AvatarFallback>VR</AvatarFallback>
          </Avatar>
        </div>
      </Section>

      <Section title="Image placeholder">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <ImagePlaceholder className="h-32 w-full" />
          <ImagePlaceholder variant="subtle" className="h-32 w-full" />
          <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-border bg-card">
            <Heart className="h-6 w-6 text-destructive" />
          </div>
        </div>
      </Section>

      <Section title="Skeleton / loading state">
        <div className="flex max-w-sm flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </Section>

      <Section title="Empty state">
        <EmptyState
          icon={Car}
          title="No cars in this category yet"
          description="We're still stocking this fleet — check back soon or browse the Popular tab."
          className="max-w-lg"
        />
      </Section>

      <Section title="Cards">
        <Card className="max-w-sm rounded-2xl border-border">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Card content area, used for dashboard panels like Best Seller and Recent Transactions.
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
