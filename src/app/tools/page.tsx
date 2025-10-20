'use client';

import React, { useState, useEffect } from 'react';
import { checkChromeAIAvailability, symptomAnalyzer } from '@/lib/chrome-ai';
import { getDeviceId } from '@/lib/utils';
import { storageService } from '@/services/storageService';
import { aiSetupService } from '@/services/aiSetupService';
import { Episode, EpisodeProgressionAnalysis } from '@/types/episode';
import {
  MdAutoAwesome,
  MdCheckCircle,
  MdWarning,
  MdInfo,
  MdSpeed,
  MdMemory,
  MdLanguage,
  MdSettings,
  MdFileDownload,
  MdFileUpload,
  MdDelete,
  MdScience,
  MdShuffle,
  MdFlashOn,
  MdSmartToy,
  MdBarChart,
  MdError,
} from 'react-icons/md';
import { FiActivity, FiCpu, FiDatabase } from 'react-icons/fi';

// Import test data - all illness progressions from the React Native version
const SYMPTOM_PROGRESSIONS = {
  cold: {
    day1: [
      { id: 'runny-nose', name: 'Runny Nose', severity: 'mild' },
      { id: 'sore-throat', name: 'Sore Throat', severity: 'mild' },
    ],
    day2: [
      { id: 'runny-nose', name: 'Runny Nose', severity: 'moderate' },
      { id: 'sore-throat', name: 'Sore Throat', severity: 'moderate' },
      { id: 'headache', name: 'Headache', severity: 'mild' },
    ],
    day3: [
      { id: 'headache', name: 'Headache', severity: 'moderate' },
      { id: 'cough', name: 'Cough', severity: 'mild' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
      { id: 'body-aches', name: 'Body Aches', severity: 'mild' },
    ],
    day4: [
      { id: 'headache', name: 'Headache', severity: 'moderate' },
      { id: 'cough', name: 'Cough', severity: 'moderate' },
      { id: 'nausea', name: 'Nausea', severity: 'mild' },
    ],
    day5: [
      { id: 'cough', name: 'Cough', severity: 'mild' },
      { id: 'fatigue', name: 'Fatigue', severity: 'mild' },
    ],
  },
  flu: {
    day1: [
      { id: 'fever', name: 'Fever', temperature: 100.2 },
      { id: 'headache', name: 'Headache', severity: 'moderate' },
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
    ],
    day2: [
      { id: 'fever', name: 'Fever', temperature: 101.8 },
      { id: 'headache', name: 'Headache', severity: 'severe' },
      { id: 'body-aches', name: 'Body Aches', severity: 'severe' },
      { id: 'chills', name: 'Chills', severity: 'moderate' },
    ],
    day3: [
      { id: 'fever', name: 'Fever', temperature: 102.1 },
      { id: 'headache', name: 'Headache', severity: 'severe' },
      { id: 'body-aches', name: 'Body Aches', severity: 'severe' },
      { id: 'nausea', name: 'Nausea', severity: 'moderate' },
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
    ],
    day4: [
      { id: 'fever', name: 'Fever', temperature: 100.8 },
      { id: 'headache', name: 'Headache', severity: 'moderate' },
      { id: 'body-aches', name: 'Body Aches', severity: 'moderate' },
      { id: 'cough', name: 'Cough', severity: 'mild' },
    ],
    day5: [
      { id: 'headache', name: 'Headache', severity: 'mild' },
      { id: 'cough', name: 'Cough', severity: 'moderate' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
  },
  stomach: {
    day1: [
      { id: 'nausea', name: 'Nausea', severity: 'mild' },
      { id: 'abdominal-cramps', name: 'Abdominal Cramps', severity: 'mild' },
    ],
    day2: [
      { id: 'nausea', name: 'Nausea', severity: 'severe' },
      {
        id: 'abdominal-cramps',
        name: 'Abdominal Cramps',
        severity: 'moderate',
      },
      { id: 'diarrhea', name: 'Diarrhea', severity: 'moderate' },
    ],
    day3: [
      { id: 'nausea', name: 'Nausea', severity: 'moderate' },
      { id: 'abdominal-cramps', name: 'Abdominal Cramps', severity: 'severe' },
      { id: 'diarrhea', name: 'Diarrhea', severity: 'severe' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
    day4: [
      { id: 'nausea', name: 'Nausea', severity: 'mild' },
      { id: 'abdominal-cramps', name: 'Abdominal Cramps', severity: 'mild' },
      { id: 'fatigue', name: 'Fatigue', severity: 'mild' },
    ],
    day5: [{ id: 'fatigue', name: 'Fatigue', severity: 'mild' }],
  },
  migraine: {
    day1: [
      {
        id: 'user-symptom-0',
        name: 'throbbing head pain',
        severity: 'moderate',
      },
      { id: 'nausea', name: 'Nausea', severity: 'mild' },
      {
        id: 'sensitivity-to-light',
        name: 'Sensitivity to Light',
        severity: 'mild',
      },
    ],
    day2: [
      { id: 'user-symptom-0', name: 'throbbing head pain', severity: 'severe' },
      { id: 'nausea', name: 'Nausea', severity: 'moderate' },
      {
        id: 'sensitivity-to-light',
        name: 'Sensitivity to Light',
        severity: 'moderate',
      },
      {
        id: 'sensitivity-to-sound',
        name: 'Sensitivity to Sound',
        severity: 'moderate',
      },
    ],
    day3: [
      { id: 'user-symptom-0', name: 'throbbing head pain', severity: 'severe' },
      { id: 'nausea', name: 'Nausea', severity: 'severe' },
      {
        id: 'sensitivity-to-light',
        name: 'Sensitivity to Light',
        severity: 'severe',
      },
      {
        id: 'sensitivity-to-sound',
        name: 'Sensitivity to Sound',
        severity: 'severe',
      },
      {
        id: 'user-symptom-1',
        name: 'aura vision changes',
        severity: 'moderate',
      },
    ],
    day4: [
      {
        id: 'user-symptom-0',
        name: 'throbbing head pain',
        severity: 'moderate',
      },
      { id: 'nausea', name: 'Nausea', severity: 'moderate' },
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
    ],
    day5: [
      { id: 'user-symptom-0', name: 'throbbing head pain', severity: 'mild' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
  },
  vertigo: {
    day1: [
      {
        id: 'user-symptom-0',
        name: 'spinning sensation',
        severity: 'moderate',
      },
      { id: 'nausea', name: 'Nausea', severity: 'mild' },
      { id: 'dizziness', name: 'Dizziness', severity: 'moderate' },
    ],
    day2: [
      { id: 'user-symptom-0', name: 'spinning sensation', severity: 'severe' },
      { id: 'nausea', name: 'Nausea', severity: 'moderate' },
      { id: 'dizziness', name: 'Dizziness', severity: 'severe' },
      { id: 'user-symptom-1', name: 'room tilting', severity: 'moderate' },
    ],
    day3: [
      { id: 'user-symptom-0', name: 'spinning sensation', severity: 'severe' },
      { id: 'nausea', name: 'Nausea', severity: 'severe' },
      { id: 'dizziness', name: 'Dizziness', severity: 'severe' },
      { id: 'user-symptom-1', name: 'room tilting', severity: 'severe' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
    day4: [
      {
        id: 'user-symptom-0',
        name: 'spinning sensation',
        severity: 'moderate',
      },
      { id: 'nausea', name: 'Nausea', severity: 'mild' },
      { id: 'dizziness', name: 'Dizziness', severity: 'moderate' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
    day5: [
      { id: 'dizziness', name: 'Dizziness', severity: 'mild' },
      { id: 'fatigue', name: 'Fatigue', severity: 'mild' },
    ],
  },
  fibromyalgia: {
    day1: [
      {
        id: 'user-symptom-0',
        name: 'widespread muscle pain',
        severity: 'moderate',
      },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
      { id: 'user-symptom-1', name: 'tender points', severity: 'mild' },
    ],
    day2: [
      {
        id: 'user-symptom-0',
        name: 'widespread muscle pain',
        severity: 'severe',
      },
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      { id: 'user-symptom-1', name: 'tender points', severity: 'moderate' },
      { id: 'user-symptom-2', name: 'brain fog', severity: 'moderate' },
    ],
    day3: [
      {
        id: 'user-symptom-0',
        name: 'widespread muscle pain',
        severity: 'severe',
      },
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      { id: 'user-symptom-1', name: 'tender points', severity: 'severe' },
      { id: 'user-symptom-2', name: 'brain fog', severity: 'severe' },
      {
        id: 'user-symptom-3',
        name: 'sleep disturbances',
        severity: 'moderate',
      },
    ],
    day4: [
      {
        id: 'user-symptom-0',
        name: 'widespread muscle pain',
        severity: 'moderate',
      },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
      { id: 'user-symptom-1', name: 'tender points', severity: 'moderate' },
      { id: 'user-symptom-2', name: 'brain fog', severity: 'moderate' },
    ],
    day5: [
      {
        id: 'user-symptom-0',
        name: 'widespread muscle pain',
        severity: 'mild',
      },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
  },
  lupus: {
    day1: [
      { id: 'user-symptom-0', name: 'butterfly rash', severity: 'mild' },
      { id: 'joint-pain', name: 'Joint Pain', severity: 'moderate' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
    day2: [
      { id: 'user-symptom-0', name: 'butterfly rash', severity: 'moderate' },
      { id: 'joint-pain', name: 'Joint Pain', severity: 'severe' },
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      { id: 'user-symptom-1', name: 'photosensitivity', severity: 'moderate' },
    ],
    day3: [
      { id: 'user-symptom-0', name: 'butterfly rash', severity: 'severe' },
      { id: 'joint-pain', name: 'Joint Pain', severity: 'severe' },
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      { id: 'user-symptom-1', name: 'photosensitivity', severity: 'severe' },
      { id: 'fever', name: 'Fever', temperature: 100.4 },
    ],
    day4: [
      { id: 'user-symptom-0', name: 'butterfly rash', severity: 'moderate' },
      { id: 'joint-pain', name: 'Joint Pain', severity: 'moderate' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
      { id: 'fever', name: 'Fever', temperature: 99.8 },
    ],
    day5: [
      { id: 'joint-pain', name: 'Joint Pain', severity: 'mild' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
  },
  crohns: {
    day1: [
      { id: 'abdominal-pain', name: 'Abdominal Pain', severity: 'moderate' },
      {
        id: 'user-symptom-0',
        name: 'urgent bowel movements',
        severity: 'mild',
      },
      { id: 'fatigue', name: 'Fatigue', severity: 'mild' },
    ],
    day2: [
      { id: 'abdominal-pain', name: 'Abdominal Pain', severity: 'severe' },
      {
        id: 'user-symptom-0',
        name: 'urgent bowel movements',
        severity: 'moderate',
      },
      { id: 'diarrhea', name: 'Diarrhea', severity: 'moderate' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
    day3: [
      { id: 'abdominal-pain', name: 'Abdominal Pain', severity: 'severe' },
      {
        id: 'user-symptom-0',
        name: 'urgent bowel movements',
        severity: 'severe',
      },
      { id: 'diarrhea', name: 'Diarrhea', severity: 'severe' },
      { id: 'user-symptom-1', name: 'blood in stool', severity: 'moderate' },
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
    ],
    day4: [
      { id: 'abdominal-pain', name: 'Abdominal Pain', severity: 'moderate' },
      {
        id: 'user-symptom-0',
        name: 'urgent bowel movements',
        severity: 'moderate',
      },
      { id: 'diarrhea', name: 'Diarrhea', severity: 'moderate' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
    day5: [
      { id: 'abdominal-pain', name: 'Abdominal Pain', severity: 'mild' },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
  },
  spinalTumor: {
    day1: [
      { id: 'user-symptom-0', name: 'hand numbness', severity: 'mild' },
      { id: 'user-symptom-1', name: 'palm tingling', severity: 'mild' },
      {
        id: 'user-symptom-2',
        name: 'loss of pain sensation',
        severity: 'mild',
      },
    ],
    day2: [
      { id: 'user-symptom-0', name: 'hand numbness', severity: 'moderate' },
      { id: 'user-symptom-1', name: 'palm tingling', severity: 'moderate' },
      {
        id: 'user-symptom-2',
        name: 'loss of pain sensation',
        severity: 'moderate',
      },
      { id: 'user-symptom-3', name: 'weakness in grip', severity: 'mild' },
    ],
    day3: [
      { id: 'user-symptom-0', name: 'hand numbness', severity: 'severe' },
      { id: 'user-symptom-1', name: 'palm tingling', severity: 'severe' },
      {
        id: 'user-symptom-2',
        name: 'loss of pain sensation',
        severity: 'severe',
      },
      { id: 'user-symptom-3', name: 'weakness in grip', severity: 'moderate' },
      { id: 'user-symptom-4', name: 'arm weakness', severity: 'mild' },
    ],
    day4: [
      { id: 'user-symptom-0', name: 'hand numbness', severity: 'severe' },
      {
        id: 'user-symptom-2',
        name: 'loss of pain sensation',
        severity: 'severe',
      },
      { id: 'user-symptom-3', name: 'weakness in grip', severity: 'severe' },
      { id: 'user-symptom-4', name: 'arm weakness', severity: 'moderate' },
      { id: 'user-symptom-5', name: 'neck stiffness', severity: 'mild' },
    ],
    day5: [
      { id: 'user-symptom-0', name: 'hand numbness', severity: 'severe' },
      {
        id: 'user-symptom-2',
        name: 'loss of pain sensation',
        severity: 'severe',
      },
      { id: 'user-symptom-3', name: 'weakness in grip', severity: 'severe' },
      { id: 'user-symptom-4', name: 'arm weakness', severity: 'severe' },
      { id: 'user-symptom-5', name: 'neck stiffness', severity: 'moderate' },
    ],
  },
  achalasia: {
    day1: [
      { id: 'user-symptom-0', name: 'difficulty swallowing', severity: 'mild' },
      {
        id: 'user-symptom-1',
        name: 'food sticking sensation',
        severity: 'mild',
      },
      { id: 'user-symptom-2', name: 'chest discomfort', severity: 'mild' },
    ],
    day2: [
      {
        id: 'user-symptom-0',
        name: 'difficulty swallowing',
        severity: 'moderate',
      },
      {
        id: 'user-symptom-1',
        name: 'food sticking sensation',
        severity: 'moderate',
      },
      { id: 'user-symptom-2', name: 'chest discomfort', severity: 'moderate' },
      { id: 'user-symptom-3', name: 'regurgitation', severity: 'mild' },
    ],
    day3: [
      {
        id: 'user-symptom-0',
        name: 'difficulty swallowing',
        severity: 'severe',
      },
      {
        id: 'user-symptom-1',
        name: 'food sticking sensation',
        severity: 'severe',
      },
      { id: 'user-symptom-2', name: 'chest discomfort', severity: 'severe' },
      { id: 'user-symptom-3', name: 'regurgitation', severity: 'moderate' },
      { id: 'user-symptom-4', name: 'weight loss', severity: 'mild' },
    ],
    day4: [
      {
        id: 'user-symptom-0',
        name: 'difficulty swallowing',
        severity: 'severe',
      },
      {
        id: 'user-symptom-1',
        name: 'food sticking sensation',
        severity: 'severe',
      },
      { id: 'user-symptom-3', name: 'regurgitation', severity: 'severe' },
      { id: 'user-symptom-4', name: 'weight loss', severity: 'moderate' },
      { id: 'user-symptom-5', name: 'nighttime coughing', severity: 'mild' },
    ],
    day5: [
      {
        id: 'user-symptom-0',
        name: 'difficulty swallowing',
        severity: 'severe',
      },
      { id: 'user-symptom-3', name: 'regurgitation', severity: 'severe' },
      { id: 'user-symptom-4', name: 'weight loss', severity: 'moderate' },
      {
        id: 'user-symptom-5',
        name: 'nighttime coughing',
        severity: 'moderate',
      },
    ],
  },
  ehlersDanlos: {
    day1: [
      {
        id: 'user-symptom-0',
        name: 'joint hypermobility',
        severity: 'moderate',
      },
      { id: 'user-symptom-1', name: 'skin hyperelasticity', severity: 'mild' },
      { id: 'joint-pain', name: 'Joint Pain', severity: 'moderate' },
    ],
    day2: [
      {
        id: 'user-symptom-0',
        name: 'joint hypermobility',
        severity: 'moderate',
      },
      {
        id: 'user-symptom-1',
        name: 'skin hyperelasticity',
        severity: 'moderate',
      },
      { id: 'joint-pain', name: 'Joint Pain', severity: 'severe' },
      { id: 'user-symptom-2', name: 'easy bruising', severity: 'moderate' },
    ],
    day3: [
      { id: 'user-symptom-0', name: 'joint hypermobility', severity: 'severe' },
      { id: 'joint-pain', name: 'Joint Pain', severity: 'severe' },
      { id: 'user-symptom-2', name: 'easy bruising', severity: 'severe' },
      {
        id: 'user-symptom-3',
        name: 'joint dislocations',
        severity: 'moderate',
      },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
    ],
    day4: [
      { id: 'joint-pain', name: 'Joint Pain', severity: 'severe' },
      { id: 'user-symptom-3', name: 'joint dislocations', severity: 'severe' },
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      { id: 'user-symptom-4', name: 'muscle weakness', severity: 'moderate' },
    ],
    day5: [
      { id: 'joint-pain', name: 'Joint Pain', severity: 'moderate' },
      {
        id: 'user-symptom-3',
        name: 'joint dislocations',
        severity: 'moderate',
      },
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
      { id: 'user-symptom-4', name: 'muscle weakness', severity: 'moderate' },
    ],
  },
  primarySclerosing: {
    day1: [
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
      { id: 'user-symptom-0', name: 'itchy skin', severity: 'mild' },
      {
        id: 'user-symptom-1',
        name: 'right upper abdominal pain',
        severity: 'mild',
      },
    ],
    day2: [
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      { id: 'user-symptom-0', name: 'itchy skin', severity: 'moderate' },
      {
        id: 'user-symptom-1',
        name: 'right upper abdominal pain',
        severity: 'moderate',
      },
      { id: 'user-symptom-2', name: 'yellowing of eyes', severity: 'mild' },
    ],
    day3: [
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      { id: 'user-symptom-0', name: 'itchy skin', severity: 'severe' },
      {
        id: 'user-symptom-1',
        name: 'right upper abdominal pain',
        severity: 'severe',
      },
      { id: 'user-symptom-2', name: 'yellowing of eyes', severity: 'moderate' },
      { id: 'user-symptom-3', name: 'dark urine', severity: 'moderate' },
    ],
    day4: [
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      { id: 'user-symptom-0', name: 'itchy skin', severity: 'severe' },
      { id: 'user-symptom-2', name: 'yellowing of eyes', severity: 'severe' },
      { id: 'user-symptom-3', name: 'dark urine', severity: 'severe' },
      { id: 'user-symptom-4', name: 'pale stools', severity: 'moderate' },
    ],
    day5: [
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      { id: 'user-symptom-0', name: 'itchy skin', severity: 'severe' },
      { id: 'user-symptom-2', name: 'yellowing of eyes', severity: 'severe' },
      { id: 'user-symptom-3', name: 'dark urine', severity: 'severe' },
      { id: 'user-symptom-4', name: 'pale stools', severity: 'severe' },
    ],
  },
  neuroendocrineTumor: {
    day1: [
      { id: 'user-symptom-0', name: 'facial flushing', severity: 'mild' },
      { id: 'user-symptom-1', name: 'heart palpitations', severity: 'mild' },
      { id: 'diarrhea', name: 'Diarrhea', severity: 'mild' },
    ],
    day2: [
      { id: 'user-symptom-0', name: 'facial flushing', severity: 'moderate' },
      {
        id: 'user-symptom-1',
        name: 'heart palpitations',
        severity: 'moderate',
      },
      { id: 'diarrhea', name: 'Diarrhea', severity: 'moderate' },
      { id: 'user-symptom-2', name: 'wheezing', severity: 'mild' },
    ],
    day3: [
      { id: 'user-symptom-0', name: 'facial flushing', severity: 'severe' },
      { id: 'user-symptom-1', name: 'heart palpitations', severity: 'severe' },
      { id: 'diarrhea', name: 'Diarrhea', severity: 'severe' },
      { id: 'user-symptom-2', name: 'wheezing', severity: 'moderate' },
      {
        id: 'user-symptom-3',
        name: 'abdominal cramping',
        severity: 'moderate',
      },
    ],
    day4: [
      { id: 'user-symptom-0', name: 'facial flushing', severity: 'severe' },
      { id: 'user-symptom-1', name: 'heart palpitations', severity: 'severe' },
      { id: 'diarrhea', name: 'Diarrhea', severity: 'severe' },
      { id: 'user-symptom-2', name: 'wheezing', severity: 'severe' },
      { id: 'user-symptom-3', name: 'abdominal cramping', severity: 'severe' },
    ],
    day5: [
      { id: 'user-symptom-0', name: 'facial flushing', severity: 'moderate' },
      {
        id: 'user-symptom-1',
        name: 'heart palpitations',
        severity: 'moderate',
      },
      { id: 'diarrhea', name: 'Diarrhea', severity: 'moderate' },
      { id: 'user-symptom-2', name: 'wheezing', severity: 'moderate' },
      {
        id: 'user-symptom-3',
        name: 'abdominal cramping',
        severity: 'moderate',
      },
    ],
  },
  liverCirrhosis: {
    day1: [
      { id: 'fatigue', name: 'Fatigue', severity: 'moderate' },
      {
        id: 'user-symptom-0',
        name: 'mild abdominal bloating',
        severity: 'mild',
      },
      { id: 'user-symptom-1', name: 'loss of appetite', severity: 'mild' },
    ],
    day2: [
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      {
        id: 'user-symptom-0',
        name: 'mild abdominal bloating',
        severity: 'moderate',
      },
      { id: 'user-symptom-1', name: 'loss of appetite', severity: 'moderate' },
      { id: 'nausea', name: 'Nausea', severity: 'mild' },
      {
        id: 'user-symptom-2',
        name: 'mild yellowing of skin',
        severity: 'mild',
      },
    ],
    day3: [
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      {
        id: 'user-symptom-0',
        name: 'abdominal swelling',
        severity: 'moderate',
      },
      { id: 'nausea', name: 'Nausea', severity: 'moderate' },
      {
        id: 'user-symptom-2',
        name: 'yellowing of skin and eyes',
        severity: 'moderate',
      },
      { id: 'user-symptom-3', name: 'dark urine', severity: 'moderate' },
      { id: 'user-symptom-4', name: 'swelling in legs', severity: 'mild' },
    ],
    day4: [
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      {
        id: 'user-symptom-0',
        name: 'severe abdominal swelling',
        severity: 'severe',
      },
      { id: 'nausea', name: 'Nausea', severity: 'severe' },
      { id: 'user-symptom-2', name: 'severe jaundice', severity: 'severe' },
      { id: 'user-symptom-3', name: 'dark urine', severity: 'severe' },
      { id: 'user-symptom-4', name: 'swelling in legs', severity: 'moderate' },
      { id: 'user-symptom-5', name: 'confusion episodes', severity: 'mild' },
    ],
    day5: [
      { id: 'fatigue', name: 'Fatigue', severity: 'severe' },
      {
        id: 'user-symptom-0',
        name: 'severe abdominal swelling',
        severity: 'severe',
      },
      { id: 'nausea', name: 'Nausea', severity: 'severe' },
      { id: 'user-symptom-2', name: 'severe jaundice', severity: 'severe' },
      { id: 'user-symptom-3', name: 'dark urine', severity: 'severe' },
      { id: 'user-symptom-4', name: 'swelling in legs', severity: 'severe' },
      {
        id: 'user-symptom-5',
        name: 'confusion episodes',
        severity: 'moderate',
      },
      { id: 'user-symptom-6', name: 'pale stools', severity: 'moderate' },
    ],
  },
} as const;

const NOTES_TEMPLATES = {
  cold: {
    day1: 'Started feeling a bit under the weather this morning. Runny nose and scratchy throat.',
    day2: 'Symptoms getting worse. Nose is really congested now and throat hurts more. Starting to get a headache.',
    day3: 'Feeling pretty lousy today. Headache is bothering me and now I have a cough. Feel tired and achy.',
    day4: 'Still not great but maybe a little better? Headache persists and cough is more noticeable. Feeling nauseous too.',
    day5: 'Definitely improving. Just have a lingering cough and still feel a bit tired.',
  },
  flu: {
    day1: 'Woke up feeling awful. High fever and terrible headache. Can barely get out of bed.',
    day2: 'This is really bad. Fever is higher and everything hurts. Having chills too.',
    day3: 'Worst day yet. High fever, severe headache and body aches. Feeling nauseous and exhausted.',
    day4: 'Fever broke a bit but still feel terrible. Headache is better but now I have a cough.',
    day5: 'Slowly improving. Headache is mild now and cough is getting worse but fever is mostly gone.',
  },
  stomach: {
    day1: 'Stomach started feeling off this afternoon. Mild nausea and some cramping.',
    day2: 'This is miserable. Very nauseous and now have diarrhea. Cramping is getting worse.',
    day3: 'Peak of whatever this is. Severe cramping and diarrhea. Feeling exhausted from it all.',
    day4: 'Finally starting to feel a bit better. Nausea is manageable and cramping is less severe.',
    day5: 'Much better today. Just feeling a bit tired from being sick.',
  },
  migraine: {
    day1: 'Started with a throbbing headache this morning. Feeling nauseous and sensitive to light.',
    day2: "This migraine is getting worse. The pain is severe and now I'm sensitive to sound too.",
    day3: "Worst day yet. Severe throbbing pain, nausea, and I'm seeing some weird vision changes.",
    day4: "Headache is starting to ease but I'm completely exhausted from this migraine.",
    day5: 'Much better today. Just a mild headache and still feeling tired from the migraine.',
  },
  vertigo: {
    day1: 'Woke up feeling like the room is spinning. Feeling dizzy and a bit nauseous.',
    day2: 'The spinning sensation is getting worse. The room keeps tilting and I feel sick.',
    day3: 'This is awful. Constant spinning and the room keeps moving. Can barely function.',
    day4: 'Spinning is getting better but still feeling dizzy and exhausted.',
    day5: 'Much improved. Just some mild dizziness left and feeling tired.',
  },
  fibromyalgia: {
    day1: 'Widespread muscle pain today. Feeling tender all over and exhausted.',
    day2: 'Pain is worse today. My tender points are really hurting and I have brain fog.',
    day3: 'Really bad flare-up. Severe muscle pain, brain fog, and sleep was terrible last night.',
    day4: 'Pain is starting to ease a bit but still feeling tender and foggy.',
    day5: 'Much better today. Just mild muscle pain and some fatigue.',
  },
  lupus: {
    day1: 'Noticed a butterfly rash on my face today. Joint pain and feeling tired.',
    day2: 'Rash is getting worse and joints are really hurting. Sensitive to sunlight too.',
    day3: 'Bad flare-up. Severe rash, joint pain, and now I have a low-grade fever.',
    day4: 'Rash and joint pain are starting to improve. Still have a slight fever.',
    day5: 'Much better today. Just mild joint pain and some fatigue.',
  },
  crohns: {
    day1: 'Stomach pain started this morning. Having urgent bowel movements and feeling tired.',
    day2: 'Abdominal pain is worse and now I have diarrhea. Very urgent bathroom trips.',
    day3: 'Severe abdominal pain and diarrhea. Noticed some blood in my stool today.',
    day4: 'Pain is getting better but still having urgent bowel movements and diarrhea.',
    day5: 'Much improved. Just mild abdominal pain and some fatigue.',
  },
  spinalTumor: {
    day1: "Strange numbness in my hand today. Palm feels tingly and I can't feel pain as well.",
    day2: 'Numbness is getting worse and my grip feels weaker. Still having that tingling sensation.',
    day3: "Really concerning now. Severe numbness, can't feel pain in my hand, and my grip is very weak.",
    day4: 'Hand numbness is severe and now my whole arm feels weak. Neck is getting stiff too.',
    day5: 'Very worried. Complete loss of pain sensation, severe weakness, and neck stiffness is worse.',
  },
  achalasia: {
    day1: "Having trouble swallowing today. Food feels like it's sticking and some chest discomfort.",
    day2: 'Swallowing is getting harder and food keeps sticking. Starting to regurgitate food.',
    day3: 'Very difficult to swallow now. Severe chest discomfort and losing weight from not eating.',
    day4: 'Can barely swallow solid foods. Regurgitation is severe and coughing at night.',
    day5: 'Swallowing is extremely difficult. Significant weight loss and nighttime coughing.',
  },
  ehlersDanlos: {
    day1: "My joints are extremely flexible today and I'm having joint pain. Skin feels stretchy.",
    day2: "Joint pain is worse and I'm bruising very easily. Joints are hypermobile.",
    day3: 'Severe joint pain and had a joint dislocation. Bruising everywhere and feeling tired.',
    day4: 'Joint dislocations are frequent and muscles feel weak. Severe fatigue.',
    day5: 'Ongoing joint issues and muscle weakness. Pain is manageable but still fatigued.',
  },
  primarySclerosing: {
    day1: 'Feeling very tired today and my skin is itchy. Some pain in my upper right abdomen.',
    day2: 'Extreme fatigue and the itching is worse. Eyes might be slightly yellow.',
    day3: 'Severe fatigue and itching. Definitely yellow in my eyes and urine is dark.',
    day4: 'Very yellow now and urine is very dark. Stools are getting pale.',
    day5: 'Severe jaundice, dark urine, and pale stools. Extremely fatigued and itchy.',
  },
  neuroendocrineTumor: {
    day1: 'Face keeps flushing red today and heart is racing. Having some diarrhea.',
    day2: 'Flushing episodes are worse and palpitations too. Diarrhea continues and some wheezing.',
    day3: 'Severe flushing and heart racing. Diarrhea is bad and wheezing with abdominal cramps.',
    day4: 'All symptoms are severe - flushing, palpitations, diarrhea, wheezing, and cramping.',
    day5: 'Symptoms are improving but still having episodes of flushing and palpitations.',
  },
  liverCirrhosis: {
    day1: 'Feeling unusually tired today and my stomach feels a bit bloated. Not very hungry.',
    day2: 'Extreme fatigue and bloating is worse. Feeling nauseous and skin looks slightly yellow.',
    day3: 'Very fatigued and stomach is swelling. Definitely yellow in skin and eyes, urine is dark.',
    day4: 'Severe abdominal swelling and very yellow. Legs are swelling and had some confusion.',
    day5: 'All symptoms severe - swelling, jaundice, confusion episodes, and very pale stools.',
  },
} as const;

const ILLNESS_TYPES = [
  'cold',
  'flu',
  'stomach',
  'migraine',
  'vertigo',
  'fibromyalgia',
  'lupus',
  'crohns',
  'spinalTumor',
  'achalasia',
  'ehlersDanlos',
  'primarySclerosing',
  'neuroendocrineTumor',
  'liverCirrhosis',
] as const;

const formatIllnessName = (illness: string): string => {
  const nameMap: { [key: string]: string } = {
    achalasia: 'Achalasia',
    cold: 'Common Cold',
    crohns: "Crohn's Disease",
    ehlersDanlos: 'Ehlers-Danlos Syndrome',
    fibromyalgia: 'Fibromyalgia',
    flu: 'Flu',
    liverCirrhosis: 'Liver Cirrhosis',
    lupus: 'Lupus',
    migraine: 'Migraine',
    neuroendocrineTumor: 'Neuroendocrine Tumor',
    primarySclerosing: 'Primary Sclerosing Cholangitis',
    spinalTumor: 'Spinal Tumor',
    stomach: 'Stomach Bug',
    vertigo: 'Vertigo',
  };
  return nameMap[illness] || illness;
};

const getAlphabetizedIllnessTypes = () => {
  return [...ILLNESS_TYPES].sort((a, b) =>
    formatIllnessName(a).localeCompare(formatIllnessName(b))
  );
};

interface AIStatusDetails {
  available: boolean;
  status: string;
  instructions?: string;
  languageModelAvailable: boolean;
}

interface StorageStatsData {
  episodeCount: number;
  entryCount: number;
  storageUsed: string;
}

export default function ToolsPage() {
  const [deviceId, setDeviceId] = useState<string>('');
  const [aiStatus, setAiStatus] = useState<AIStatusDetails | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [storageStats, setStorageStats] = useState<StorageStatsData | null>(
    null
  );
  const [loadingStats, setLoadingStats] = useState(false);

  // Test data generator state
  const [dayCount, setDayCount] = useState(3);
  const [selectedIllness, setSelectedIllness] = useState<string>('random');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  useEffect(() => {
    setDeviceId(getDeviceId());

    // Check Chrome AI availability
    async function checkAI() {
      const status = await checkChromeAIAvailability();
      setAiStatus(status);
    }
    checkAI();
  }, []);

  const loadStorageStats = async () => {
    setLoadingStats(true);
    try {
      const stats = await storageService.getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleExportData = async () => {
    try {
      const exportData = await storageService.exportData();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whenimsick-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const jsonData = e.target?.result as string;
        await storageService.importData(jsonData);
        await loadStorageStats();
        alert('Data imported successfully!');
      } catch (error) {
        console.error('Failed to import data:', error);
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = async () => {
    if (
      confirm(
        'Are you sure you want to clear all stored data? This action cannot be undone.'
      )
    ) {
      try {
        await storageService.clearCollection('episodes');
        await storageService.clearCollection('symptom_entries');
        await storageService.clearCollection('glossary');
        await loadStorageStats();
        alert('All data cleared successfully');
      } catch (error) {
        console.error('Failed to clear data:', error);
        alert('Failed to clear data');
      }
    }
  };

  const generateRandomTestData = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setProgress(0);
    setCurrentStep('Initializing...');
    setMessage({ type: null, text: '' });

    try {
      // Pick illness type based on selection
      const illnessType =
        selectedIllness === 'random'
          ? ILLNESS_TYPES[Math.floor(Math.random() * ILLNESS_TYPES.length)]
          : (selectedIllness as keyof typeof SYMPTOM_PROGRESSIONS);
      const progression = SYMPTOM_PROGRESSIONS[illnessType];
      const notes = NOTES_TEMPLATES[illnessType];

      console.log(`🧪 Generating ${dayCount} days of ${illnessType} test data`);

      // Generate random consecutive dates within the last 5 years
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const fiveYearsAgo = new Date(today);
      fiveYearsAgo.setFullYear(today.getFullYear() - 5);

      const maxStartDate = new Date(today);
      maxStartDate.setDate(today.getDate() - (dayCount + 30));

      if (maxStartDate < fiveYearsAgo) {
        throw new Error(
          'Date range calculation error. Please try with fewer days.'
        );
      }

      const randomTime =
        fiveYearsAgo.getTime() +
        Math.random() * (maxStartDate.getTime() - fiveYearsAgo.getTime());
      const startDate = new Date(randomTime);
      startDate.setHours(0, 0, 0, 0);

      // Generate consecutive dates from the random start date
      const dates = [];
      for (let i = 0; i < dayCount; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateString = date.toISOString().split('T')[0];

        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          throw new Error(`Invalid date format generated: ${dateString}`);
        }

        dates.push(dateString);
      }

      if (dates.length !== dayCount) {
        throw new Error(
          `Expected ${dayCount} dates, but generated ${dates.length}`
        );
      }

      console.log(
        `📅 Generated date range: ${dates[0]} to ${dates[dates.length - 1]}`
      );

      // Initialize Chrome AI for symptom analysis
      console.log('🤖 Initializing Chrome built-in AI...');
      await symptomAnalyzer.initialize();
      console.log('✅ Chrome AI initialized successfully');

      // Generate entries with some days having multiple entries
      const allEntries = [];
      for (let dayIndex = 0; dayIndex < dayCount; dayIndex++) {
        const dayNumber = dayIndex + 1;
        const entryDate = dates[dayIndex];

        const shouldHaveMultipleEntries = Math.random() < 0.02 && dayIndex > 0;
        const entriesPerDay = shouldHaveMultipleEntries
          ? Math.floor(Math.random() * 3) + 2
          : 1;

        for (let entryIndex = 0; entryIndex < entriesPerDay; entryIndex++) {
          allEntries.push({
            dayIndex,
            entryDate,
            dayNumber,
            entryIndex,
            entriesPerDay,
          });
        }
      }

      // Track the episodeId across all days
      let trackedEpisodeId: string | null = null;

      // Generate entries for each day
      for (let entryIndex = 0; entryIndex < allEntries.length; entryIndex++) {
        const entryInfo = allEntries[entryIndex];
        const {
          dayIndex,
          entryDate,
          dayNumber,
          entryIndex: dayEntryIndex,
          entriesPerDay,
        } = entryInfo;

        setCurrentStep(
          `Generating day ${dayNumber} of ${dayCount} (${entryDate}) - Entry ${dayEntryIndex + 1} of ${entriesPerDay}...`
        );
        setProgress((entryIndex / allEntries.length) * 100);

        // Get symptoms for this day
        let daySymptoms;
        if (
          dayNumber <= 5 &&
          progression[`day${dayNumber}` as keyof typeof progression]
        ) {
          daySymptoms =
            progression[`day${dayNumber}` as keyof typeof progression];
        } else {
          const lastDay =
            progression.day5 || progression.day4 || progression.day3;
          if (dayNumber === 6) {
            daySymptoms = lastDay
              .map((symptom: SymptomData) => ({
                ...symptom,
                severity:
                  symptom.severity === 'severe'
                    ? 'moderate'
                    : symptom.severity === 'moderate'
                      ? 'mild'
                      : 'mild',
              }))
              .slice(0, Math.max(1, lastDay.length - 1));
          } else {
            const lingeringSymptoms = lastDay.filter(
              (s: SymptomData) =>
                s.id === 'fatigue' || s.name.toLowerCase().includes('fatigue')
            );
            daySymptoms =
              lingeringSymptoms.length > 0
                ? lingeringSymptoms.map((s: SymptomData) => ({
                    ...s,
                    severity: 'mild' as const,
                  }))
                : [
                    {
                      id: 'fatigue',
                      name: 'Fatigue',
                      severity: 'mild' as const,
                    },
                  ];
          }
        }

        // Get notes for this day
        let dayNotes;
        if (dayNumber <= 5 && notes[`day${dayNumber}` as keyof typeof notes]) {
          dayNotes = notes[`day${dayNumber}` as keyof typeof notes];
        } else {
          if (dayNumber === 6) {
            dayNotes =
              'Feeling much better today. Most symptoms are improving and becoming more manageable.';
          } else {
            dayNotes =
              'Almost back to normal. Just some lingering fatigue but overall feeling much better.';
          }
        }

        // Prepare symptoms in the format expected by the API
        interface SymptomData {
          id: string;
          name: string;
          severity?: string;
          temperature?: number;
        }
        const apiSymptoms = daySymptoms.map((symptom: SymptomData) => ({
          symptom: {
            id: symptom.id,
            name: symptom.name,
            category: 'common',
          },
          optionalValues: (() => {
            const values: { [key: string]: string | number } = {};
            if ('severity' in symptom && symptom.severity) {
              values.severity = symptom.severity;
            }
            if ('temperature' in symptom && symptom.temperature) {
              values.temperature = symptom.temperature;
              values.unit = 'fahrenheit';
            }
            return values;
          })(),
        }));

        // Prepare illness history
        interface ApiSymptom {
          symptom: { id: string; name: string; category: string };
          optionalValues: { [key: string]: string | number };
        }
        const illnessHistory: Array<{
          date: string;
          entries: Array<{
            time: string;
            symptoms: ApiSymptom[];
            notes: string | null;
          }>;
          dayNumber: number;
        }> = [];
        const entriesByDate = new Map<
          string,
          Array<{
            time: string;
            symptoms: ApiSymptom[];
            notes: string | null;
          }>
        >();

        for (let historyIndex = 0; historyIndex < dayIndex; historyIndex++) {
          const historyDayNumber = historyIndex + 1;
          const historyDate = dates[historyIndex];
          const historyDayKey =
            `day${Math.min(historyDayNumber, 5)}` as keyof typeof progression;
          let historySymptomsData;
          if (progression[historyDayKey]) {
            historySymptomsData = progression[historyDayKey];
          } else {
            const lastHistoryDay =
              progression.day5 || progression.day4 || progression.day3;
            historySymptomsData = lastHistoryDay.map((symptom: SymptomData) => ({
              ...symptom,
              severity: 'mild' as const,
            }));
          }

          const historySymptoms = historySymptomsData.map((symptom: SymptomData) => ({
            symptom: {
              id: symptom.id,
              name: symptom.name,
              category: 'common',
            },
            optionalValues: (() => {
              const values: { [key: string]: string | number } = {};
              if ('severity' in symptom && symptom.severity) {
                values.severity = symptom.severity;
              }
              if ('temperature' in symptom && symptom.temperature) {
                values.temperature = symptom.temperature;
                values.unit = 'fahrenheit';
              }
              return values;
            })(),
          }));

          let historyNotes;
          if (
            historyDayNumber <= 5 &&
            notes[`day${historyDayNumber}` as keyof typeof notes]
          ) {
            historyNotes =
              notes[`day${historyDayNumber}` as keyof typeof notes];
          } else {
            historyNotes = null;
          }

          const entry = {
            time: (() => {
              const hour = Math.min(8 + historyIndex, 23);
              const timeString = `${historyDate}T${String(hour).padStart(2, '0')}:00:00.000Z`;
              return new Date(timeString).toISOString();
            })(),
            symptoms: historySymptoms,
            notes: historyNotes,
          };

          if (!entriesByDate.has(historyDate)) {
            entriesByDate.set(historyDate, []);
          }
          entriesByDate.get(historyDate)!.push(entry);
        }

        const sortedDates = Array.from(entriesByDate.keys()).sort();
        sortedDates.forEach((date, index) => {
          const dayEntries = entriesByDate.get(date)!;
          const sortedDayEntries = dayEntries.sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
          );

          illnessHistory.push({
            date: date,
            entries: sortedDayEntries,
            dayNumber: index + 1,
          });
        });

        // Prepare API payload
        const apiPayload = {
          symptoms: apiSymptoms,
          notes: dayNotes,
          timestamp: (() => {
            let hour;
            if (entriesPerDay === 1) {
              hour = Math.min(8 + dayIndex, 23);
            } else {
              const timeSlots = [8, 12, 16, 20];
              hour = timeSlots[dayEntryIndex % timeSlots.length];
            }

            const timeString = `${entryDate}T${String(hour).padStart(2, '0')}:00:00.000Z`;
            const timestamp = new Date(timeString);

            if (isNaN(timestamp.getTime())) {
              throw new Error(`Invalid timestamp generated: ${timeString}`);
            }

            return timestamp.toISOString();
          })(),
          entryDate: entryDate,
          deviceId: deviceId,
          ...(dayNumber > 1
            ? {
                dayNumber: illnessHistory.length + 1,
                illnessHistory: illnessHistory,
              }
            : {}),
        };

        console.log(`🤖 Using Chrome built-in AI for day ${dayNumber}:`, {
          date: entryDate,
          symptoms: apiSymptoms.map((s: ApiSymptom) => s.symptom.name),
          hasHistory: illnessHistory.length > 0,
        });

        // Extract symptom names for Chrome AI
        const symptomNames = apiSymptoms.map((s: ApiSymptom) => s.symptom.name);

        // Prepare episode context for multi-day progressions
        let episodeContext: EpisodeProgressionAnalysis | undefined;
        if (dayNumber > 1 && illnessHistory.length > 0) {
          // Analyze symptom changes from previous days
          const previousSymptoms = new Set(
            illnessHistory[illnessHistory.length - 1].entries
              .flatMap((e: { symptoms: ApiSymptom[] }) => e.symptoms)
              .map((s: ApiSymptom) => s.symptom.name)
          );
          const currentSymptoms = new Set(symptomNames);

          const newSymptoms = symptomNames.filter(s => !previousSymptoms.has(s));
          const resolvedSymptoms = Array.from(previousSymptoms).filter(
            s => !currentSymptoms.has(s)
          );
          const ongoingSymptoms = symptomNames.filter(s => previousSymptoms.has(s));

          // Determine trend (simplified logic for test data)
          let trend: 'improving' | 'stable' | 'worsening' = 'stable';
          if (dayNumber > 3) {
            trend = 'improving'; // Most illnesses improve after day 3
          } else if (newSymptoms.length > resolvedSymptoms.length) {
            trend = 'worsening';
          } else if (resolvedSymptoms.length > newSymptoms.length) {
            trend = 'improving';
          }

          episodeContext = {
            dayNumber: dayNumber,
            trend: trend,
            symptomChanges: {
              new: newSymptoms,
              resolved: resolvedSymptoms,
              ongoing: ongoingSymptoms,
              severityChanges: [],
            },
            progressionSummary: `Day ${dayNumber} of ${illnessType} illness`,
            previousEntries: [], // Test data generator doesn't need previous entries
          };
        }

        // Use Chrome's built-in AI to analyze symptoms
        const aiResult = await symptomAnalyzer.analyzeSymptoms(
          symptomNames,
          dayNotes,
          episodeContext
        );

        console.log(`✅ Chrome AI analysis completed for day ${dayNumber}:`, {
          severity: aiResult.severity,
          trend: aiResult.trend,
          hasTerms: aiResult.medicalTerms?.length || 0,
        });

        // Use tracked episodeId or generate new one
        if (!trackedEpisodeId) {
          trackedEpisodeId = aiResult.episodeTitle
            ? `episode_${dates[0]}_${aiResult.episodeTitle.toLowerCase().replace(/\s+/g, '_').substring(0, 30)}`
            : `episode_${dates[0]}_${Math.random().toString(36).substr(2, 9)}`;
        }

        const entryId = `entry_${entryDate}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const episodeId = trackedEpisodeId as string;

        // Create properly formatted symptom entry
        const entry = {
          id: entryId,
          episodeId: episodeId,
          date: entryDate,
          symptoms: symptomNames,
          notes: dayNotes || undefined,
          severity: aiResult.severity,
          aiAnalysis: {
            dailySummary: aiResult.dailySummary || '',
            analysis: aiResult.analysis || '',
            informationNotes: aiResult.informationNotes || [],
            severity: aiResult.severity || 'moderate',
            trend: aiResult.trend,
            medicalConsultationSuggested:
              aiResult.medicalConsultationSuggested || false,
            reasonForConsultation: aiResult.reasonForConsultation || '',
            selfCareTips: aiResult.selfCareTips || [],
            estimatedRecoveryWindow:
              aiResult.estimatedRecoveryWindow || '',
            followUpQuestion: aiResult.followUpQuestion || '',
            medicalTerms: aiResult.medicalTerms || [],
            citations: aiResult.citations || [],
          },
          createdAt: apiPayload.timestamp,
          updatedAt: apiPayload.timestamp,
        };

        await storageService.setItem('symptom_entries', entryId, entry);

        // Get or create episode
        const existingEpisode = await storageService.getItem<Episode>(
          'episodes',
          episodeId
        );

        let episode;
        if (!existingEpisode) {
          // Create new episode
          episode = {
            id: episodeId,
            deviceId: deviceId,
            startDate: dates[0],
            title:
              aiResult.episodeTitle ||
              `${formatIllnessName(illnessType)} Episode`,
            symptoms: symptomNames,
            severity: aiResult.severity,
            status: 'active',
            entryCount: 1,
            createdAt: apiPayload.timestamp,
            updatedAt: apiPayload.timestamp,
          };
        } else {
          // Update existing episode
          episode = {
            ...existingEpisode,
            entryCount: (existingEpisode.entryCount || 0) + 1,
            updatedAt: apiPayload.timestamp,
            symptoms: Array.from(
              new Set([...(existingEpisode.symptoms || []), ...symptomNames])
            ),
          };
        }

        await storageService.setItem('episodes', episodeId, episode);

        console.log(`💾 Entry saved for day ${dayNumber} (${entryDate})`);
      }

      setProgress(100);
      setCurrentStep('Complete!');

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
        setCurrentStep('');
        // Reload storage stats if on storage tool
        if (selectedTool === 'storage-data') {
          loadStorageStats();
        }
      }, 1000);

      setMessage({
        type: 'success',
        text: `Test Data Generated Successfully!\n\nCreated ${dayCount} days of realistic ${illnessType} progression with AI analysis from ${dates[0]} to ${dates[dates.length - 1]}. The data includes symptom evolution, severity changes, and contextual medical insights.`,
      });
    } catch (error) {
      console.error('❌ Error generating test data:', error);
      setIsGenerating(false);
      setProgress(0);
      setCurrentStep('');

      setMessage({
        type: 'error',
        text: `Test Data Generation Failed\n\nFailed to generate test data: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
      });
    }
  };

  const renderToolContent = () => {
    if (!selectedTool) {
      return (
        <div className='details-panel-empty'>
          <div className='empty-state'>
            <div className='empty-icon'>
              <MdSettings
                size={64}
                style={{ color: '#FF6B9D', opacity: 0.4 }}
              />
            </div>
            <h3
              style={{
                color: 'var(--text-primary)',
                fontSize: '1.5rem',
                fontWeight: '400',
              }}
            >
              Select a Tool
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Click on a tool from the left panel to view details and settings
            </p>
          </div>
        </div>
      );
    }

    if (selectedTool === 'ai-status') {
      return (
        <div style={{ padding: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid var(--pastel-pink-dark)',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <MdAutoAwesome
                size={28}
                style={{ color: 'var(--accent-pink)' }}
              />
              <h2
                style={{
                  fontSize: '1.75rem',
                  margin: 0,
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                }}
              >
                Chrome AI Status
              </h2>
            </div>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Status Card */}
            <div
              style={{
                background: aiStatus?.available
                  ? 'var(--pastel-mint)'
                  : 'var(--pastel-peach)',
                border: `2px solid ${aiStatus?.available ? 'var(--pastel-mint-dark)' : 'var(--pastel-peach-dark)'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: aiStatus?.available
                    ? 'var(--accent-mint)'
                    : 'var(--accent-peach)',
                  marginBottom: '0.75rem',
                }}
              >
                {aiStatus?.available ? (
                  <MdCheckCircle size={24} />
                ) : (
                  <MdWarning size={24} />
                )}
                {aiStatus?.available
                  ? 'AI is Available'
                  : 'AI is Not Available'}
              </h3>
              <p
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                }}
              >
                {aiStatus?.status}
              </p>
            </div>

            {/* Instructions Card (if AI not available) */}
            {!aiStatus?.available && aiStatus?.instructions && (
              <div
                style={{
                  background: 'var(--pastel-yellow)',
                  border: '2px solid var(--pastel-yellow-dark)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                }}
              >
                <h3
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    color: 'var(--accent-yellow)',
                    marginBottom: '0.75rem',
                  }}
                >
                  <MdInfo size={20} />
                  Setup Instructions
                </h3>
                <p
                  style={{
                    margin: 0,
                    lineHeight: '1.6',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {aiStatus.instructions}
                </p>
              </div>
            )}

            {/* AI Setup Management */}
            <div
              style={{
                background: 'var(--pastel-lavender)',
                border: '2px solid var(--pastel-lavender-dark)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: 'var(--accent-lavender)',
                  marginBottom: '0.75rem',
                }}
              >
                <MdSettings size={20} />
                AI Setup Management
              </h3>
              <p
                style={{
                  margin: '0 0 1rem 0',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                }}
              >
                Reset AI setup status if you need to reconfigure Chrome AI or troubleshoot issues.
              </p>
              <button
                onClick={() => {
                  aiSetupService.resetAISetup();
                  alert('AI setup status has been reset. You will be redirected to setup on your next visit to the home page.');
                }}
                style={{
                  background: 'var(--accent-lavender)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9375rem',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--accent-lavender-dark)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'var(--accent-lavender)';
                }}
              >
                Reset AI Setup Status
              </button>
            </div>

            {/* AI Capabilities Card */}
            <div
              style={{
                background: 'var(--pastel-blue)',
                border: '2px solid var(--pastel-blue-dark)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: 'var(--accent-blue)',
                  marginBottom: '1rem',
                }}
              >
                <FiCpu size={20} />
                AI Capabilities
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <MdSpeed size={18} style={{ color: 'var(--accent-blue)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    On-device processing for privacy
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <MdMemory size={18} style={{ color: 'var(--accent-blue)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Gemini Nano model
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <MdLanguage
                    size={18}
                    style={{ color: 'var(--accent-blue)' }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    English language support
                  </span>
                </div>
              </div>
            </div>

            {/* Configuration Card */}
            <div
              style={{
                background: 'var(--pastel-lavender)',
                border: '2px solid var(--pastel-lavender-dark)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: 'var(--accent-lavender)',
                  marginBottom: '1rem',
                }}
              >
                <MdSettings size={20} />
                Current Configuration
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '8px',
                  }}
                >
                  <span
                    style={{ fontWeight: '400', color: 'var(--text-primary)' }}
                  >
                    Temperature:
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    0.1 (Low creativity, high precision)
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '8px',
                  }}
                >
                  <span
                    style={{ fontWeight: '400', color: 'var(--text-primary)' }}
                  >
                    Top-K:
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    1 (Deterministic responses)
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '8px',
                  }}
                >
                  <span
                    style={{ fontWeight: '400', color: 'var(--text-primary)' }}
                  >
                    Output Language:
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    English (en)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedTool === 'storage-data') {
      // Load stats when storage tool is selected
      if (!storageStats && !loadingStats) {
        loadStorageStats();
      }

      return (
        <div style={{ padding: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid var(--pastel-blue-dark)',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <FiDatabase size={28} style={{ color: 'var(--accent-blue)' }} />
              <h2
                style={{
                  fontSize: '1.75rem',
                  margin: 0,
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                }}
              >
                Storage & Data
              </h2>
            </div>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Storage Statistics Card */}
            <div
              style={{
                background: 'var(--pastel-mint)',
                border: '2px solid var(--pastel-mint-dark)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--accent-mint)',
                  marginBottom: '1rem',
                }}
              >
                <MdInfo size={24} />
                Storage Statistics
              </h3>

              {loadingStats ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem',
                  }}
                >
                  <div className='loading-spinner' />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Loading statistics...
                  </span>
                </div>
              ) : storageStats ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: 'var(--accent-mint)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {storageStats.episodeCount}
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Episodes
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: 'var(--accent-mint)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {storageStats.entryCount}
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Entries
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: 'var(--accent-mint)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {storageStats.storageUsed}
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Storage Used
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Data Management Card */}
            <div
              style={{
                background: 'var(--pastel-blue)',
                border: '2px solid var(--pastel-blue-dark)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--accent-blue)',
                  marginBottom: '1rem',
                }}
              >
                <MdSettings size={24} />
                Data Management
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <button
                  onClick={handleExportData}
                  disabled={!storageStats || storageStats.episodeCount === 0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem 1.5rem',
                    background:
                      'linear-gradient(135deg, var(--pastel-mint) 0%, var(--pastel-mint-dark) 100%)',
                    border: '2px solid var(--pastel-mint-dark)',
                    borderRadius: '12px',
                    color: 'var(--accent-mint)',
                    fontSize: '1rem',
                    fontWeight: '400',
                    cursor: storageStats?.episodeCount
                      ? 'pointer'
                      : 'not-allowed',
                    opacity: storageStats?.episodeCount ? 1 : 0.5,
                    transition: 'all 0.2s ease',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (storageStats?.episodeCount) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(82, 183, 136, 0.3)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <MdFileDownload size={24} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700' }}>Export Data</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                      Download all your data as JSON
                    </div>
                  </div>
                </button>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem 1.5rem',
                    background:
                      'linear-gradient(135deg, var(--pastel-yellow) 0%, var(--pastel-yellow-dark) 100%)',
                    border: '2px solid var(--pastel-yellow-dark)',
                    borderRadius: '12px',
                    color: 'var(--accent-yellow)',
                    fontSize: '1rem',
                    fontWeight: '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    width: '100%',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(255, 201, 71, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <MdFileUpload size={24} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700' }}>Import Data</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                      Restore from a JSON backup
                    </div>
                  </div>
                  <input
                    type='file'
                    accept='.json'
                    onChange={handleImportData}
                    style={{ display: 'none' }}
                  />
                </label>

                <button
                  onClick={handleClearAllData}
                  disabled={!storageStats || storageStats.episodeCount === 0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem 1.5rem',
                    background:
                      'linear-gradient(135deg, var(--pastel-coral) 0%, var(--pastel-coral-dark) 100%)',
                    border: '2px solid var(--pastel-coral-dark)',
                    borderRadius: '12px',
                    color: 'var(--accent-coral)',
                    fontSize: '1rem',
                    fontWeight: '400',
                    cursor: storageStats?.episodeCount
                      ? 'pointer'
                      : 'not-allowed',
                    opacity: storageStats?.episodeCount ? 1 : 0.5,
                    transition: 'all 0.2s ease',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (storageStats?.episodeCount) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(255, 117, 143, 0.3)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <MdDelete size={24} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700' }}>Clear All Data</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                      Permanently delete all stored data
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Privacy Info Card */}
            <div
              style={{
                background: 'var(--pastel-lavender)',
                border: '2px solid var(--pastel-lavender-dark)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: 'var(--accent-lavender)',
                  marginBottom: '0.75rem',
                }}
              >
                <MdInfo size={20} />
                Privacy Information
              </h3>
              <p
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                }}
              >
                All your data is stored locally in your browser&apos;s IndexedDB.
                Nothing is sent to any server. Clearing your browser data will
                remove all episodes and entries.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedTool === 'test-data') {
      return (
        <div style={{ padding: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid var(--pastel-mint-dark)',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <MdScience size={28} style={{ color: 'var(--accent-mint)' }} />
              <h2
                style={{
                  fontSize: '1.75rem',
                  margin: 0,
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                }}
              >
                Test Data Generator
              </h2>
            </div>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Description Card */}
            <div
              style={{
                background: 'var(--pastel-blue)',
                border: '2px solid var(--pastel-blue-dark)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                }}
              >
                Generate realistic illness progressions with AI analysis for
                testing. This creates complete episodes with consecutive dates
                and symptom evolution.
              </p>
            </div>

            {/* Duration Configuration */}
            <div
              style={{
                background: 'var(--pastel-lavender)',
                border: '2px solid var(--pastel-lavender-dark)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--accent-lavender)',
                  marginBottom: '1rem',
                }}
              >
                Illness Duration
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Number of consecutive sick days
                </p>
                <p
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'var(--accent-lavender)',
                    margin: '0.5rem 0',
                  }}
                >
                  {dayCount} day{dayCount !== 1 ? 's' : ''}
                </p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1rem',
                  }}
                >
                  Will generate random dates within the last 5 years
                </p>
                <input
                  type='range'
                  min='1'
                  max='7'
                  step='1'
                  value={dayCount}
                  onChange={e => setDayCount(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: `linear-gradient(to right, var(--accent-lavender) 0%, var(--accent-lavender) ${((dayCount - 1) / 6) * 100}%, #e5e7eb ${((dayCount - 1) / 6) * 100}%, #e5e7eb 100%)`,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>

            {/* Illness Type Selection */}
            <div
              style={{
                background: 'var(--pastel-yellow)',
                border: '2px solid var(--pastel-yellow-dark)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--accent-yellow)',
                  marginBottom: '1rem',
                }}
              >
                Illness Type Selection
              </h3>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                }}
              >
                Choose specific illness or random
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <button
                  onClick={() => setSelectedIllness('random')}
                  disabled={isGenerating}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background:
                      selectedIllness === 'random'
                        ? 'var(--accent-yellow)'
                        : 'rgba(255, 255, 255, 0.5)',
                    border: `2px solid ${selectedIllness === 'random' ? 'var(--accent-yellow)' : 'var(--pastel-yellow-dark)'}`,
                    borderRadius: '8px',
                    color:
                      selectedIllness === 'random'
                        ? 'white'
                        : 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: isGenerating ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <MdShuffle size={16} />
                  Random
                </button>

                {getAlphabetizedIllnessTypes().map(illness => (
                  <button
                    key={illness}
                    onClick={() => setSelectedIllness(illness)}
                    disabled={isGenerating}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background:
                        selectedIllness === illness
                          ? 'var(--accent-yellow)'
                          : 'rgba(255, 255, 255, 0.5)',
                      border: `2px solid ${selectedIllness === illness ? 'var(--accent-yellow)' : 'var(--pastel-yellow-dark)'}`,
                      borderRadius: '8px',
                      color:
                        selectedIllness === illness
                          ? 'white'
                          : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      fontWeight: '400',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isGenerating ? 0.5 : 1,
                    }}
                  >
                    {formatIllnessName(illness)}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Display */}
            {message.type && (
              <div
                style={{
                  background:
                    message.type === 'success'
                      ? 'var(--pastel-mint)'
                      : 'var(--pastel-coral)',
                  border: `2px solid ${message.type === 'success' ? 'var(--pastel-mint-dark)' : 'var(--pastel-coral-dark)'}`,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  {message.type === 'success' ? (
                    <MdCheckCircle
                      size={24}
                      style={{
                        color: 'var(--accent-mint)',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    />
                  ) : (
                    <MdError
                      size={24}
                      style={{
                        color: 'var(--accent-coral)',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    />
                  )}
                  <p
                    style={{
                      margin: 0,
                      lineHeight: '1.6',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'pre-line',
                      fontSize: '0.875rem',
                    }}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateRandomTestData}
              disabled={isGenerating}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '1.5rem',
                background: isGenerating
                  ? 'linear-gradient(135deg, var(--pastel-blue) 0%, var(--pastel-blue-dark) 100%)'
                  : 'linear-gradient(135deg, var(--pastel-mint) 0%, var(--pastel-mint-dark) 100%)',
                border: `2px solid ${isGenerating ? 'var(--pastel-blue-dark)' : 'var(--pastel-mint-dark)'}`,
                borderRadius: '12px',
                color: isGenerating
                  ? 'var(--accent-blue)'
                  : 'var(--accent-mint)',
                fontSize: '1.125rem',
                fontWeight: '700',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                width: '100%',
              }}
              onMouseEnter={e => {
                if (!isGenerating) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 20px rgba(82, 183, 136, 0.3)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              {isGenerating ? (
                <>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      border: '3px solid var(--accent-blue)',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <MdAutoAwesome size={24} />
                  <span>Generate Test Data</span>
                </>
              )}
            </button>

            {/* Progress Indicator */}
            {isGenerating && (
              <div
                style={{
                  background: 'var(--pastel-blue)',
                  border: '2px solid var(--pastel-blue-dark)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                }}
              >
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--accent-blue)',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    fontWeight: '400',
                  }}
                >
                  {currentStep}
                </p>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      backgroundColor: 'var(--accent-blue)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Info Card */}
            <div
              style={{
                background: 'var(--pastel-pink)',
                border: '2px solid var(--pastel-pink-dark)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <MdFlashOn
                    size={20}
                    style={{
                      color: 'var(--accent-pink)',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      lineHeight: '1.6',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    This generates realistic illness progressions (14 different
                    illness types) with consecutive dates.
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <MdSmartToy
                    size={20}
                    style={{
                      color: 'var(--accent-pink)',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      lineHeight: '1.6',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    Each day gets real AI analysis with symptom progression
                    context.
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <MdBarChart
                    size={20}
                    style={{
                      color: 'var(--accent-pink)',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      lineHeight: '1.6',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    Perfect for testing multi-day illness tracking, episode
                    detection, and chronic condition monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add keyframes for spinner animation */}
          <style jsx>{`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      );
    }

    return null;
  };

  const tools = [
    {
      id: 'ai-status',
      name: 'Chrome AI Status',
      icon: MdAutoAwesome,
      description: 'View and manage Chrome AI configuration',
      color: 'var(--accent-pink)',
      bgColor: 'var(--pastel-pink)',
      borderColor: 'var(--pastel-pink-dark)',
    },
    {
      id: 'storage-data',
      name: 'Storage & Data',
      icon: MdMemory,
      description: 'Manage your stored episodes and data',
      color: 'var(--accent-blue)',
      bgColor: 'var(--pastel-blue)',
      borderColor: 'var(--pastel-blue-dark)',
    },
    {
      id: 'test-data',
      name: 'Test Data Generator',
      icon: FiActivity,
      description: 'Generate realistic illness episodes for testing',
      color: 'var(--accent-mint)',
      bgColor: 'var(--pastel-mint)',
      borderColor: 'var(--pastel-mint-dark)',
    },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
      height: '100%',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 5
    }}>
      {/* Tools Layout */}
      <div className='episodes-layout'>
            {/* Left Panel - Tools List */}
            <div className='timeline-panel'>
              <div className='timeline-header'>
                <h2>Tools & Settings</h2>
                <div className='timeline-stats'>
                  <span>
                    {tools.length} tool{tools.length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              <div
                className='timeline-list'
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {tools.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1.25rem',
                        background:
                          selectedTool === tool.id ? tool.bgColor : 'white',
                        border: `2px solid ${selectedTool === tool.id ? tool.borderColor : '#e5e7eb'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        width: '100%',
                        boxShadow:
                          selectedTool === tool.id
                            ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                            : '0 1px 3px rgba(0, 0, 0, 0.05)',
                      }}
                      onMouseEnter={e => {
                        if (selectedTool !== tool.id) {
                          e.currentTarget.style.borderColor = tool.borderColor;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (selectedTool !== tool.id) {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow =
                            '0 1px 3px rgba(0, 0, 0, 0.05)';
                        }
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: tool.bgColor,
                          border: `2px solid ${tool.borderColor}`,
                        }}
                      >
                        <Icon size={24} style={{ color: tool.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '1.125rem',
                            fontWeight: '400',
                            color: 'var(--text-primary)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {tool.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)',
                            lineHeight: '1.4',
                          }}
                        >
                          {tool.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Panel - Tool Details */}
            <div className='details-panel'>{renderToolContent()}</div>
          </div>
    </div>
  );
}
