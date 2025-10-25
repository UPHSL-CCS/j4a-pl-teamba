import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthProvider with ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  User? _user;
  bool _isLoading = false;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;

  AuthProvider() {
    // Listen to auth state changes
    _auth.authStateChanges().listen((User? user) {
      _user = user;
      notifyListeners();
    });
  }

  Future<String?> signInWithEmail(String email, String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      _isLoading = false;
      notifyListeners();
      return null; // Success
    } on FirebaseAuthException catch (e) {
      _isLoading = false;
      notifyListeners();
      return e.message ?? 'An error occurred during sign in';
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return 'An unexpected error occurred';
    }
  }

  Future<String?> signUpWithEmail(String email, String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      _isLoading = false;
      notifyListeners();
      return null; // Success
    } on FirebaseAuthException catch (e) {
      _isLoading = false;
      notifyListeners();
      return e.message ?? 'An error occurred during sign up';
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return 'An unexpected error occurred';
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }

  Future<String?> getIdToken() async {
    if (_user != null) {
      return await _user!.getIdToken();
    }
    return null;
  }
}
