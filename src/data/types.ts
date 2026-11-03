export type Project = {
  id: string
  number: string
  title: string
  client: string
  link?: string
  period: string
  summary: string
  role: string
  bullets?: string[]
  tags: string[]
}

export type Stat = {
  id: string
  number: string
  label: string
  project: string
  description: string
  tags: string[]
}

export type CareerItem = {
  year: string
  period: string
  title: string
  company: string
  description: string
  bullets: string[]
}

export type EducationItem = {
  degree: string
  school: string
  year: string
}

export type Language = {
  name: string
  level: string
}

export type Profile = {
  name: string
  role: string
  location: string
  headline: string
  bio: string
  availability: string
  email: string
  phone: string
  whatsappLink: string
  github: string
  linkedin: string
  calendar: string
}
