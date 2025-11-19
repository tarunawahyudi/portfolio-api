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
        <Text key={index} style={{ marginBottom: 3 }}>
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
    marginBottom: 15,
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
    marginBottom: 5,
  },

  companyOverview: {
    fontSize: 9.5,
    color: '#4b5563',
    lineHeight: 1.4,
    marginTop: 5,
    marginBottom: 10,
  },
  jobDescriptionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  jobDeskContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 10,
    break: 'avoid',
  },
  jobDeskBullet: {
    fontSize: 8.5,
    width: 10,
    color: '#4b5563',
  },
  jobDeskText: {
    fontSize: 8.5,
    flex: 1,
    color: '#4b5563',
    lineHeight: 1.3,
  },
  educationItem: {
    marginBottom: 10,
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
  educationDescription: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.4,
    marginBottom: 5,
  },
  educationGrade: {
    fontSize: 10,
    fontWeight: 'normal',
    color: '#6b7280',
    marginBottom: 10,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
})

interface MainContentProps {
  profile: {
    bio: string
  }
  experiences: Array<{
    position: string
    company: string
    overview?: string
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
    description?: string
    grade?: string
  }>
  t: {
    profile: string
    workExperience: string
    education: string
    present: string
    jobDescription: string
    companyOverview: string
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
        <Text style={styles.sectionTitle}>{t.education}</Text>
        {educations.map((education, index) => (
          <View key={index} style={styles.educationItem}>

            <View style={styles.educationHeader}>
              <Text style={styles.institution}>{education.institution}</Text>
              <Text style={styles.educationDate}>
                {education.startDate} - {education.endDate}
              </Text>
            </View>

            <Text style={styles.degree}>
              {education.degree} - {education.fieldOfStudy}
            </Text>

            {education.grade && (
              <Text style={styles.educationGrade}>
                Grade: {education.grade}
              </Text>
            )}

            {education.description && (
              <HtmlRenderer html={education.description} style={styles.educationDescription} />
            )}
          </View>
        ))}
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

            {experience.overview && (
              <>
                {t.companyOverview && (
                  <Text style={styles.jobDescriptionTitle}>{t.companyOverview}</Text>
                )}
                <Text style={styles.companyOverview}>{experience.overview}</Text>
              </>
            )}

            {experience.jobDesk && experience.jobDesk.length > 0 && (
              <>
                <Text style={styles.jobDescriptionTitle}>{t.jobDescription}</Text>

                <View>
                  {experience.jobDesk.map((jobDeskItem, jobDeskIndex) => (
                    <View
                      key={jobDeskIndex}
                      style={styles.jobDeskContainer}
                    >
                      <Text style={styles.jobDeskBullet}>•</Text>
                      <Text style={styles.jobDeskText}>
                        {jobDeskItem}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        ))}
      </View>

    </View>
  )
}
