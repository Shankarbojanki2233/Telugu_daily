import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Chrome as Home, ChevronDown, ChevronRight } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { NotoSansTelugu_400Regular } from '@expo-google-fonts/noto-sans-telugu';
import { sentences } from '@/data/sentences';

export default function PreviousScreen() {
  let [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'NotoSansTelugu-Regular': NotoSansTelugu_400Regular,
  });

  const [currentDay] = useState(5); // Demo: showing as if user is on day 5
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>({});

  const handleTextToSpeech = async (text: string, isEnglish: boolean = true) => {
    try {
      const language = isEnglish ? 'en-US' : 'te-IN';
      await Speech.speak(text, {
        language,
        pitch: 1.0,
        rate: 0.8,
      });
    } catch (error) {
      console.log('TTS Error:', error);
    }
  };

  const toggleDayExpansion = (day: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const getDaysSentences = (day: number) => {
    const startIndex = (day - 1) * 50;
    const endIndex = day * 50;
    return sentences.slice(startIndex, endIndex);
  };

  const getTotalLearnedSentences = () => {
    return currentDay * 50;
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#F5A623', '#E6941F']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Previous Days</Text>
          <TouchableOpacity style={styles.homeButton}>
            <Home size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          {getTotalLearnedSentences()} sentences learned across {currentDay} days
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Array.from({ length: currentDay }, (_, index) => {
          const day = index + 1;
          const daySentences = getDaysSentences(day);
          const isExpanded = expandedDays[day];
          
          return (
            <View key={day} style={styles.dayContainer}>
              <TouchableOpacity
                style={styles.dayHeader}
                onPress={() => toggleDayExpansion(day)}
              >
                <View style={styles.dayHeaderLeft}>
                  <Text style={styles.dayNumber}>Day {day}</Text>
                  <Text style={styles.dayRange}>
                    Sentences {(day - 1) * 50 + 1} - {day * 50}
                  </Text>
                </View>
                <View style={styles.dayHeaderRight}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>50</Text>
                  </View>
                  {isExpanded ? (
                    <ChevronDown size={20} color="#2AA8A8" />
                  ) : (
                    <ChevronRight size={20} color="#2AA8A8" />
                  )}
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.sentencesContainer}>
                  {daySentences.map((sentence, sentenceIndex) => {
                    const globalIndex = (day - 1) * 50 + sentenceIndex;
                    
                    return (
                      <View key={sentenceIndex} style={styles.sentenceCard}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.sentenceNumber}>#{globalIndex + 1}</Text>
                          <View style={styles.dayTag}>
                            <Text style={styles.dayTagText}>Day {day}</Text>
                          </View>
                        </View>
                        
                        <TouchableOpacity 
                          style={styles.teluguContainer}
                          onPress={() => handleTextToSpeech(sentence.telugu, false)}
                        >
                          <Text style={styles.teluguText}>{sentence.telugu}</Text>
                          <Play size={18} color="#2AA8A8" style={styles.playIcon} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.englishContainer}
                          onPress={() => handleTextToSpeech(sentence.english, true)}
                        >
                          <Text style={styles.englishText}>{sentence.english}</Text>
                          <Play size={14} color="#F5A623" style={styles.playIcon} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Learning Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{currentDay}</Text>
              <Text style={styles.statLabel}>Days Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{getTotalLearnedSentences()}</Text>
              <Text style={styles.statLabel}>Total Sentences</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>50</Text>
              <Text style={styles.statLabel}>Daily Average</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  homeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dayContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dayHeaderLeft: {
    flex: 1,
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#2C3E50',
  },
  dayRange: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    marginTop: 2,
  },
  dayHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayBadge: {
    backgroundColor: '#2AA8A8',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dayBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  sentencesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sentenceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sentenceNumber: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#2AA8A8',
  },
  dayTag: {
    backgroundColor: '#F5A623',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dayTagText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
  },
  teluguContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  teluguText: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'NotoSansTelugu-Regular',
    color: '#2C3E50',
    lineHeight: 28,
  },
  playIcon: {
    marginLeft: 8,
    marginTop: 4,
  },
  englishContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  englishText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2C3E50',
    lineHeight: 20,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    marginBottom: 40,
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#2AA8A8',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    marginTop: 4,
  },
});