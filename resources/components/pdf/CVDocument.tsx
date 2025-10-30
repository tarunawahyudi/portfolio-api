import React from 'react'
import {
  Document,
  Page,
  StyleSheet,
  View,
} from '@react-pdf/renderer'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    fontSize: 10,
    fontFamily: 'Helvetica',
    padding: 30,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
  },
})

interface CVDocumentProps {
  data: {
    profile: {
      fullName: string
      jobTitle: string
      email: string
      phoneNumber: string
      website: string
      address: string
      bio: string
      avatarUrl?: string
    }
    skills: Array<{ name: string }>
    experiences: Array<{
      position: string
      company: string
      startDate: string
      endDate?: string
      isCurrent: boolean
      jobDesk?: string[]
    }>
    educations: Array<{
      institution: string
      degree: string
      fieldOfStudy: string
      startDate: string
      endDate: string
    }>
  }
  t: {
    contact: string
    skills: string
    profile: string
    workExperience: string
    education: string
    email: string
    phone: string
    website: string
    address: string
    present: string
    jobDescription: string
  }
}

export function CVDocument({ data, t }: CVDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Sidebar profile={data.profile} skills={data.skills} t={t} />
          <MainContent
            profile={data.profile}
            experiences={data.experiences}
            educations={data.educations}
            t={t}
          />
        </View>
      </Page>
    </Document>
  )
}
