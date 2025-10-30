// Sidebar.tsx

import React from 'react'
import { StyleSheet, View, Text, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  sidebar: {
    width: '33.33%',
    backgroundColor: '#1f2937',
    padding: 30,
    color: '#d1d5db',
    flexDirection: 'column',
  },
  sidebarContent: {
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#374151',
    objectFit: 'cover',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textAlign: 'center',
  },
  jobTitle: {
    fontSize: 14,
    color: '#2dd4bf',
    textAlign: 'center',
    marginBottom: 0,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#2dd4bf',
    paddingBottom: 4,
    marginBottom: 15,
  },
  contactItem: {
    marginBottom: 10,
  },
  contactLabel: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 10,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 9,
    color: '#d1d5db',
    lineHeight: 1.4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  skill: {
    backgroundColor: '#374151',
    padding: 4,
    borderRadius: 4,
    fontSize: 8,
  },
})

interface SidebarProps {
  profile: {
    fullName: string
    jobTitle: string
    email: string
    phoneNumber: string
    website: string
    address: string
    avatarUrl?: string
  }
  skills: Array<{ name: string }>
  t: {
    contact: string
    skills: string
    email: string
    phone: string
    website: string
    address: string
  }
}

export function Sidebar({ profile, skills, t }: SidebarProps) {
  const contactData = [
    { label: t.email, value: profile.email },
    { label: t.phone, value: profile.phoneNumber },
    { label: t.website, value: profile.website },
    { label: t.address, value: profile.address },
  ]

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarContent}>
        <View style={styles.header}>
          {profile.avatarUrl && <Image src={profile.avatarUrl} style={styles.avatar} />}
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.jobTitle}>{profile.jobTitle}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.contact}</Text>

          {contactData.map((item, index) => (
            <View key={index} style={styles.contactItem}>
              <Text style={styles.contactLabel}>{item.label}:</Text>
              <Text style={styles.contactValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.skills}</Text>
          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <Text key={index} style={styles.skill}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}
