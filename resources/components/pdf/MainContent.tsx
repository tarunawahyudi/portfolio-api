import React from 'react'
import { StyleSheet, View, Text } from '@react-pdf/renderer'

const HtmlRenderer = ({ html, style }: { html: string; style?: any }) => {
  if (!html) return null
  let cleanText = html.replace(/<br\s*\/?>/g, '\n')
  cleanText = cleanText.replace(/<\/?p>/g, '\n\n').trim()
  cleanText = cleanText.replace(/<[^>]*>/g, '')
  const lines = cleanText.split('\n').filter((line) => line.trim() !== '')

  return (
    <View style={{ ...style }}>
      {lines.map((line, index) => (
        <Text key={index} style={{ marginBottom: 5 }}>
          {line.trim()}
        </Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContent: {
    width: '66.67%',
    paddingHorizontal: 30,
    paddingVertical: 0,
    color: '#111827',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db',
    paddingBottom: 8,
    marginBottom: 15,
  },
  profileTextContainer: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 25,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  position: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  date: {
    fontSize: 9,
    color: '#6b7280',
  },
  company: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  jobDescriptionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  jobDeskItem: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 5,
    marginLeft: 15,
  },
  educationItem: {
    marginBottom: 20,
  },
  institution: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  degree: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 2,
  },
  educationDate: {
    fontSize: 9,
    color: '#6b7280',
  },
})

interface MainContentProps {
  profile: {
    bio: string
  }
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
  t: {
    profile: string
    workExperience: string
    education: string
    present: string
    jobDescription: string
  }
}

export function MainContent({ profile, experiences, educations, t }: MainContentProps) {
  return (
    <View style={styles.mainContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.profile}</Text>
        <HtmlRenderer html={profile.bio} style={styles.profileTextContainer} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.workExperience}</Text>
        {experiences.map((experience, index) => (
          <View key={index} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <Text style={styles.position}>{experience.position}</Text>
              <Text style={styles.date}>
                {experience.startDate} - {experience.isCurrent ? t.present : experience.endDate}
              </Text>
            </View>
            <Text style={styles.company}>{experience.company}</Text>

            {experience.jobDesk && experience.jobDesk.length > 0 && (
              <>
                <Text style={styles.jobDescriptionTitle}>{t.jobDescription}</Text>
                {experience.jobDesk.map((jobDeskItem, jobDeskIndex) => (
                  <Text key={jobDeskIndex} style={styles.jobDeskItem}>
                    • {jobDeskItem}
                  </Text>
                ))}
              </>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.education}</Text>
        {educations.map((education, index) => (
          <View key={index} style={styles.educationItem}>
            <Text style={styles.institution}>{education.institution}</Text>
            <Text style={styles.degree}>
              {education.degree} - {education.fieldOfStudy}
            </Text>
            <Text style={styles.educationDate}>
              {education.startDate} - {education.endDate}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
