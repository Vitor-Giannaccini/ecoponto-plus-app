// screens/ProfileScreen.js

import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    TextInput,
    Modal,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
    Platform,
    KeyboardAvoidingView
} from 'react-native';

import { mask } from 'react-native-mask-text';
import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { signOut, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateEmail, deleteUser } from "firebase/auth";
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import StyledInput from '../components/StyledInput';

const ProfileScreen = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editableFullName, setEditableFullName] = useState('');
    const [editablePhone, setEditablePhone] = useState('');
    const [editableBirthDate, setEditableBirthDate] = useState('');

    // States para o modal inteligente
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    
    // States para os campos do modal
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) { setLoading(false); return; }
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setProfileData(data);
                setEditableFullName(data.fullName);
                setEditablePhone(data.phone);
                setEditableBirthDate(data.birthDate); 
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Função para salvar as alterações
    const handleUpdateProfile = async () => {
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userDocRef, {
                    fullName: editableFullName,
                    phone: editablePhone,
                    birthDate: editableBirthDate,
                });
                Alert.alert("Sucesso", "Seu perfil foi atualizado.");
                setIsEditing(false); // Volta para o modo de visualização
            } catch (error) {
                console.error("Erro ao atualizar perfil: ", error);
                Alert.alert("Erro", "Não foi possível atualizar seu perfil.");
            }
        }
    };

    // Função para resetar e fechar o modal
    const resetAndCloseModal = () => {
        setModalVisible(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setNewEmail('');
        setModalContent('');
    };

    // --- LÓGICA DE GERENCIAMENTO DE CONTA COM MODAIS ---

    // Passo 1: O usuário clica em uma ação, abrimos o modal de reautenticação
    const triggerSensitiveAction = (action) => {
        setModalContent(`reauth_${action}`); // Ex: 'reauth_change_password'
        setModalVisible(true);
    };

    // Passo 2: O usuário confirma a senha atual no modal
    const handleReauthenticate = async () => {
        if (!currentPassword) { Alert.alert("Erro", "Digite sua senha atual."); return; }

        try {
            const user = auth.currentUser;
            const cred = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, cred);

            // Reautenticação bem-sucedida, avança para o próximo passo
            if (modalContent === 'reauth_change_password') setModalContent('new_password');
            if (modalContent === 'reauth_change_email') setModalContent('new_email');
            if (modalContent === 'reauth_delete_account') setModalContent('delete_confirm');
            
        } catch (error) {
            Alert.alert("Erro de autenticação", "A senha atual está incorreta.");
        }
    };
    
    // Passo 3: O usuário preenche os dados finais no modal
    const handleFinalAction = async () => {
        const user = auth.currentUser;
        if (!user) return;

        switch (modalContent) {
            case 'new_password':
                if (newPassword.length < 6) { Alert.alert("Erro", "A nova senha precisa ter no mínimo 6 caracteres."); return; }
                if (newPassword !== confirmNewPassword) { Alert.alert("Erro", "As novas senhas não coincidem."); return; }
                if (newPassword === currentPassword) {Alert.alert("Senha inválida", "A nova senha não pode ser igual à senha atual."); return;}

                try {
                    await updatePassword(user, newPassword);
                    Alert.alert("Sucesso", "Sua senha foi alterada!");
                    resetAndCloseModal();
                } catch (err) { Alert.alert("Erro", "Não foi possível alterar a senha."); }
                break;
            
            case 'delete_confirm':
                try {
                    // Apaga dados do Firestore
                    await deleteUser(user);
                    Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso.");
                    resetAndCloseModal(); // O ouvinte no AppNavigator cuidará do resto
                } catch (err) { Alert.alert("Erro", "Não foi possível excluir a conta."); }
                break;
        }
    };

    const handleEmailChange = async () => {
        // 1. Validações iniciais
        if (!newEmail || !newEmail.includes('@')) { Alert.alert("Erro", "Digite um e-mail válido."); return; }
        if (newEmail === profileData.email) { Alert.alert("Aviso", "O novo e-mail é igual ao atual."); return; }
        if (!currentPassword) { Alert.alert("Erro", "Digite sua senha atual para confirmar."); return; }

        try {
            // 2. Reautentica o usuário com a senha fornecida
            const user = auth.currentUser;
            const cred = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, cred);
            
            // 3. Altera o e-mail na Autenticação
            await updateEmail(user, newEmail);
            
            // 4. Altera o e-mail também no Firestore
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { email: newEmail });

            Alert.alert("Sucesso", "Seu e-mail foi alterado!");
            resetAndCloseModal();
        } catch (error) {
            console.error("Erro ao alterar e-mail:", error);
            if (error.code === 'auth/wrong-password') {
                Alert.alert("Erro", "A senha atual está incorreta.");
            } else {
                Alert.alert("Erro", "Não foi possível alterar o e-mail. Ele pode ser inválido ou já estar em uso.");
            }
        }
    };

    // Função de logout
    const handleLogout = () => {
        signOut(auth).catch(error => Alert.alert("Erro de Logout", error.message));
    };

    if (loading) { return <ActivityIndicator size="large" color={COLORS.primary} style={styles.centered} />; }

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView 
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Ionicons name="person-circle-outline" size={100} color={COLORS.primary} />
                    <Text style={styles.userName}>{profileData?.fullName?.split(' ')[0] || 'Usuário'}</Text>
                    <Text style={styles.userEmail}>{profileData?.email || 'email@exemplo.com'}</Text>
                </View>

                <Text style={styles.sectionTitle}>Minhas informações</Text>
                <View style={styles.infoCard}>

                    {/* --- CAMPO NOME (EDITÁVEL) --- */}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nome completo</Text>
                        {isEditing ? (
                            <TextInput style={styles.input} value={editableFullName} onChangeText={setEditableFullName} />
                        ) : (
                            <Text style={styles.infoValue}>{profileData?.fullName}</Text>
                        )}
                    </View>
                    <View style={styles.separator} />

                    {/* --- CAMPO TELEFONE (EDITÁVEL) --- */}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Telefone</Text>
                        {isEditing ? (
                            <TextInput style={styles.input} value={editablePhone} onChangeText={setEditablePhone} keyboardType="phone-pad"/>
                        ) : (
                            <Text style={styles.infoValue}>
                                {mask(profileData?.phone, ['(99) 9999-9999', '(99) 99999-9999'])}
                            </Text>
                        )}
                    </View>
                    <View style={styles.separator} />

                    {/* --- CAMPO DATA DE NASCIMENTO (EDITÁVEL) --- */}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Data de nascimento</Text>
                        {isEditing ? (
                            <TextInput 
                                style={styles.input} 
                                value={editableBirthDate} 
                                onChangeText={setEditableBirthDate}
                                placeholder="DD/MM/AAAA"
                                keyboardType="numeric"
                            />
                        ) : (
                            <Text style={styles.infoValue}>
                                {mask(profileData?.birthDate, '99/99/9999')}
                            </Text>
                        )}
                    </View>
                    <View style={styles.separator} />

                    {/* --- CAMPO CPF (BLOQUEADO) --- */}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>CPF</Text>
                        <Text style={[
                            styles.infoValue, 
                            styles.disabledText,
                            isEditing && styles.disabledBackground 
                        ]}>
                            {mask(profileData?.cpf, '999.999.999-99')}
                        </Text>
                    </View>
                </View>

                {/* --- BOTÕES DE AÇÃO --- */}
                {isEditing ? (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsEditing(false)}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdateProfile}>
                            <Text style={styles.saveButtonText}>Salvar alterações</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                        <Ionicons name="pencil" size={20} color={'#555555'} style={{ marginRight: 10 }} />
                        <Text style={styles.editButtonText}>Editar perfil</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.sectionTitle}>Gerenciamento da conta</Text>
                <View style={styles.actionsCard}>
                    <TouchableOpacity style={styles.actionRow} onPress={() => { setModalContent('change_email'); setModalVisible(true); }}>
                        <Ionicons name="mail-outline" size={22} color={COLORS.dark} />
                        <Text style={styles.actionText}>Alterar e-mail</Text>
                        <Ionicons name="chevron-forward" size={22} color="grey" />
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity style={styles.actionRow} onPress={() => triggerSensitiveAction('change_password')}>
                        <Ionicons name="key-outline" size={22} color={COLORS.dark} />
                        <Text style={styles.actionText}>Alterar senha</Text>
                        <Ionicons name="chevron-forward" size={22} color="grey" />
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity style={[styles.actionRow, { borderBottomWidth: 0 }]} onPress={() => triggerSensitiveAction('delete_account')}>
                        <Ionicons name="trash-outline" size={22} color={'#c0392b'} />
                        <Text style={[styles.actionText, { color: '#c0392b' }]}>Excluir conta</Text>
                        <Ionicons name="chevron-forward" size={22} color="grey" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color={'#c0392b'} style={{ marginRight: 10 }} />
                    <Text style={styles.logoutButtonText}>Sair (Logout)</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* --- MODAL DE REAUTENTICAÇÃO --- */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                presentationStyle="overFullScreen"
                onRequestClose={resetAndCloseModal} // Para o botão "voltar" do Android
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === "ios" ? "padding" : "height"} 
                        style={styles.modalOverlay}
                    >
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                
                                {/* --- CONTEÚDO DO PASSO 1: REAUTENTICAÇÃO --- */}
                                {/reauth/.test(modalContent) && (
                                    <>
                                        <Text style={styles.modalTitle}>Confirme sua identidade</Text>
                                        <Text style={styles.modalSubtitle}>Digite sua senha atual para continuar.</Text>
                                        <StyledInput style={styles.modalInput} placeholder="Senha atual" isPassword value={currentPassword} onChangeText={setCurrentPassword}/>
                                        <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleReauthenticate}>
                                            <Text style={styles.modalButtonConfirmText}>Confirmar</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {/* --- CONTEÚDO DO PASSO 2: NOVA SENHA --- */}
                                {modalContent === 'new_password' && (
                                    <>
                                        <Text style={styles.modalTitle}>Defina sua nova senha</Text>
                                        <StyledInput style={styles.modalInput} placeholder="Nova senha" isPassword value={newPassword} onChangeText={setNewPassword}/>
                                        <StyledInput style={styles.modalInput} placeholder="Confirme a nova senha" isPassword value={confirmNewPassword} onChangeText={setConfirmNewPassword}/>
                                        <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleFinalAction}>
                                            <Text style={styles.modalButtonConfirmText}>Salvar nova senha</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {/* --- CONTEÚDO DO PASSO 2: ALTERAR E-MAIL --- */}
                                {modalContent === 'change_email' && (
                                    <>
                                        <Text style={styles.modalTitle}>Alterar e-mail</Text>
                                        <Text style={styles.modalSubtitle}>Digite seu novo e-mail e confirme com sua senha atual.</Text>
                                        <StyledInput style={styles.modalInput} placeholder="Novo e-mail" keyboardType="email-address" autoCapitalize="none" value={newEmail} onChangeText={setNewEmail}/>
                                        <StyledInput style={styles.modalInput} placeholder="Senha atual" isPassword value={currentPassword} onChangeText={setCurrentPassword}/>
                                        <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleEmailChange}>
                                            <Text style={styles.modalButtonConfirmText}>Salvar novo e-mail</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {/* --- CONTEÚDO DO PASSO 2: CONFIRMAR EXCLUSÃO --- */}
                                {modalContent === 'delete_confirm' && (
                                    <>
                                        <Text style={styles.modalTitle}>Excluir conta</Text>
                                        <Text style={styles.modalSubtitle}>Esta ação é permanente e não pode ser desfeita. Todos os seus dados e pontos serão perdidos.</Text>
                                        <TouchableOpacity style={[styles.modalButtonConfirm, {backgroundColor: '#c0392b'}]} onPress={handleFinalAction}>
                                            <Text style={styles.modalButtonConfirmText}>Sim, excluir minha conta</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {/* Botão de Cancelar Padrão */}
                                <TouchableOpacity style={{marginTop: 15}} onPress={resetAndCloseModal}>
                                    <Text style={{color: 'grey'}}>Cancelar</Text>
                                </TouchableOpacity>
                                
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        paddingBottom: 140,
    },
    header: {
        backgroundColor: 'white',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        color: COLORS.dark,
    },
    userEmail: {
        fontSize: 16,
        color: 'grey',
        marginTop: 5,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginHorizontal: 20,
    },
    infoRow: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    infoLabel: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.dark,
    },
    disabledText: {
        color: '#aaa',
    },
    disabledBackground: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#c0392b'
    },
    logoutButtonText: {
        color: '#c0392b',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 18,
        color: COLORS.dark,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 20 ,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 10, flex: 1,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#eee',
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#555',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        marginLeft: 10,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editButton: { //VER
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#555555',
    },
    editButtonText: {
        color: '#555555',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionsCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 20
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.dark,
        marginLeft: 15
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: 'grey',
        marginBottom: 10,
    },
    modalInput: {
        width: '100%',
        height: 50,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        fontSize: 16,
    },
    modalButtonConfirm: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%' ,
        marginTop: 10,
    },
    modalButtonConfirmText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ProfileScreen;