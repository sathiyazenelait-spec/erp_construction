import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<'DPR' | 'ATTENDANCE' | 'APPROVALS' | 'SCANNER'>('DPR');

  // DPR State
  const [dprProject, setDprProject] = useState('Skyline Residences');
  const [dprZone, setDprZone] = useState('Tower B - 14th Floor');
  const [dprProgress, setDprProgress] = useState('85');
  const [dprWorkDone, setDprWorkDone] = useState('Rebar tying completed for shear wall SW-03. Formwork shuttering 90%. Ready for inspection.');
  const [dprSubmitted, setDprSubmitted] = useState(false);

  // Attendance State
  const [laborCount, setLaborCount] = useState('42');
  const [masons, setMasons] = useState('14');
  const [helpers, setHelpers] = useState('28');
  const [checkedIn, setCheckedIn] = useState(false);

  // Approvals State
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'PO-2026-118', title: 'Tata Tiscon Fe550 Steel (25.5 MT)', amount: '$1,560,000', type: 'Purchase Order', status: 'PENDING' },
    { id: 'RA-BILL-401', title: 'Subcontractor L&T Formwork Casting', amount: '$420,000', type: 'RA Bill #04', status: 'PENDING' },
    { id: 'NCR-2026-001', title: 'Shear Wall Honeycombing Closure', amount: 'Civil Safety', type: 'Quality NCR', status: 'PENDING' }
  ]);

  const handleDprSubmit = () => {
    if (!dprWorkDone) {
      Alert.alert('Missing Info', 'Please describe work completed today.');
      return;
    }
    setDprSubmitted(true);
    Alert.alert('DPR Submitted', `Daily Progress Report for ${dprProject} logged successfully with GPS timestamp.`);
  };

  const handleAttendanceCheckIn = () => {
    setCheckedIn(true);
    Alert.alert('GPS Muster Verified', `Location verified: Chennai OMR Site (Accuracy: 4.2m). Total ${laborCount} workers mustered.`);
  };

  const handleApprovalAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setPendingApprovals(pendingApprovals.map(item => item.id === id ? { ...item, status: action } : item));
    Alert.alert(action === 'APPROVED' ? 'Approved' : 'Rejected', `${id} marked as ${action}. Audit log registered.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080E1A" />

      {/* Mobile App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>BuildCon Mobile ERP</Text>
          <Text style={styles.headerSubtitle}>Site Engineer & Field Operations</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LIVE GPS</Text>
        </View>
      </View>

      {/* Screen Body */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* TAB 1: SITE DPR */}
        {activeTab === 'DPR' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Daily Progress Report (DPR)</Text>
            <Text style={styles.sectionSub}>Upload real-time site updates & milestone %</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Active Project</Text>
              <TextInput
                style={styles.input}
                value={dprProject}
                onChangeText={setDprProject}
                placeholderTextColor="#64748B"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location / Work Zone</Text>
              <TextInput
                style={styles.input}
                value={dprZone}
                onChangeText={setDprZone}
                placeholderTextColor="#64748B"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Work Completion (%)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={dprProgress}
                onChangeText={setDprProgress}
                placeholderTextColor="#64748B"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Site Execution Summary</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                value={dprWorkDone}
                onChangeText={setDprWorkDone}
                placeholderTextColor="#64748B"
              />
            </View>

            <TouchableOpacity style={styles.photoButton} onPress={() => Alert.alert('Camera', 'Photo captured: IMG_SITE_PROGRESS_2026.jpg (EXIF Geotagged)')}>
              <Text style={styles.photoButtonText}>📷 Attach Site Photos / Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleDprSubmit}>
              <Text style={styles.submitButtonText}>
                {dprSubmitted ? '✓ DPR Dispatched' : 'Submit DPR to Project Manager'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TAB 2: ATTENDANCE */}
        {activeTab === 'ATTENDANCE' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Geo-Fenced Labor Attendance</Text>
            <Text style={styles.sectionSub}>Morning biometric check-in & head count</Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{laborCount}</Text>
                <Text style={styles.statLabel}>Total Present</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{masons}</Text>
                <Text style={styles.statLabel}>Skilled Masons</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{helpers}</Text>
                <Text style={styles.statLabel}>Helpers</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adjust Head Count</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={laborCount}
                onChangeText={setLaborCount}
                placeholderTextColor="#64748B"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, checkedIn && { backgroundColor: '#10B981' }]}
              onPress={handleAttendanceCheckIn}
            >
              <Text style={styles.submitButtonText}>
                {checkedIn ? '✓ Site Muster Verified (GPS Locked)' : '📍 Verify GPS Location & Muster In'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TAB 3: APPROVALS */}
        {activeTab === 'APPROVALS' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Executive Push Approvals</Text>
            <Text style={styles.sectionSub}>Review and authorize pending field requests</Text>

            {pendingApprovals.map((item) => (
              <View key={item.id} style={styles.approvalItem}>
                <View style={styles.approvalHeader}>
                  <Text style={styles.approvalId}>{item.id}</Text>
                  <Text style={styles.approvalType}>{item.type}</Text>
                </View>
                <Text style={styles.approvalTitle}>{item.title}</Text>
                <Text style={styles.approvalAmount}>{item.amount}</Text>

                {item.status === 'PENDING' ? (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleApprovalAction(item.id, 'APPROVED')}
                    >
                      <Text style={styles.btnText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleApprovalAction(item.id, 'REJECTED')}
                    >
                      <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={[styles.statusBadge, item.status === 'APPROVED' ? styles.statusGreen : styles.statusRed]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* TAB 4: SCANNER */}
        {activeTab === 'SCANNER' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Store Inward GRN Scanner</Text>
            <Text style={styles.sectionSub}>Scan delivery vehicle QR codes & weighbridge slips</Text>

            <View style={styles.scannerBox}>
              <Text style={styles.scannerIcon}>📷</Text>
              <Text style={styles.scannerText}>Point camera at material barcode / QR challan</Text>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => Alert.alert('Scanned QR', 'Verified GRN: 25.5 MT Fe550 TMT Rebar (PO-2026-118). Stock updated.')}
            >
              <Text style={styles.submitButtonText}>Simulate Inward Barcode Scan</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('DPR')}
        >
          <Text style={[styles.navIcon, activeTab === 'DPR' && styles.navActive]}>📝</Text>
          <Text style={[styles.navText, activeTab === 'DPR' && styles.navActive]}>Site DPR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('ATTENDANCE')}
        >
          <Text style={[styles.navIcon, activeTab === 'ATTENDANCE' && styles.navActive]}>👥</Text>
          <Text style={[styles.navText, activeTab === 'ATTENDANCE' && styles.navActive]}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('APPROVALS')}
        >
          <Text style={[styles.navIcon, activeTab === 'APPROVALS' && styles.navActive]}>⚡</Text>
          <Text style={[styles.navText, activeTab === 'APPROVALS' && styles.navActive]}>Approvals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('SCANNER')}
        >
          <Text style={[styles.navIcon, activeTab === 'SCANNER' && styles.navActive]}>📦</Text>
          <Text style={[styles.navText, activeTab === 'SCANNER' && styles.navActive]}>GRN Scan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080E1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0C1527',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#0F192E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#080E1A',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 13,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  photoButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  photoButtonText: {
    color: '#38BDF8',
    fontWeight: '600',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#080E1A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38BDF8',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  approvalItem: {
    backgroundColor: '#080E1A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  approvalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  approvalId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#38BDF8',
    fontFamily: 'monospace',
  },
  approvalType: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '600',
  },
  approvalTitle: {
    fontSize: 13,
    color: '#F8FAFC',
    fontWeight: '500',
  },
  approvalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#10B981',
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  statusBadge: {
    marginTop: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#F8FAFC',
  },
  scannerBox: {
    height: 180,
    backgroundColor: '#080E1A',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scannerIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  scannerText: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#0C1527',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
    color: '#64748B',
  },
  navText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  navActive: {
    color: '#38BDF8',
    fontWeight: 'bold',
  },
});
