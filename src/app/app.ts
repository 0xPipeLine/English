// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { words, management } from './words'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  private dictionary: { [key: string]: string } = words;
  private remainingWords: string[] = [];
  private wrongWords: string[] = [];
  private usedWords: Set<string> = new Set();
  
  currentWord: string = '';
  userAnswer: string = '';
  feedback: string = '';
  feedbackType: 'correct' | 'wrong' | '' = '';
  correctCount: number = 0;
  wrongCount: number = 0;
  totalWords: number = 0;
  reviewMode: boolean = false;

  ngOnInit() {
    this.initializeWords();
    this.nextWord();
  }

  private initializeWords(): void {
    this.remainingWords = Object.keys(this.dictionary);
    this.totalWords = this.remainingWords.length;
    this.shuffleArray(this.remainingWords);
  }

  private shuffleArray(array: string[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private getRandomWord(): string {
    if (this.reviewMode && this.wrongWords.length > 0) {
      const index = Math.floor(Math.random() * this.wrongWords.length);
      return this.wrongWords[index];
    }
    if (this.remainingWords.length > 0) {return this.remainingWords[0]; }
    if (this.wrongWords.length > 0) {
      this.reviewMode = true;
      this.feedback = '🔄 Mode révision : mots ratés';
      return this.wrongWords[0];
    }
    this.initializeWords();
    return this.remainingWords[0];
  }

  nextWord(): void {
    this.currentWord = this.getRandomWord();
    this.userAnswer = '';
    this.feedback = '';
    this.feedbackType = '';
  }

  checkAnswer(): void {
    if (!this.userAnswer.trim()) return;
    const correctAnswer = this.dictionary[this.currentWord].toLowerCase();
    const answer = this.userAnswer.trim().toLowerCase();
    if (answer === correctAnswer) {
      this.feedbackType = 'correct';
      this.feedback = '✓ Correct !';
      this.correctCount++;
      if (!this.reviewMode) {
        this.remainingWords.shift();
        this.usedWords.add(this.currentWord);
      } else {
        const index = this.wrongWords.indexOf(this.currentWord);
        if (index > -1) this.wrongWords.splice(index, 1);
        if (this.wrongWords.length === 0) {
          this.reviewMode = false;
          this.feedback = '🎉 Tous les mots révisés !';
        }}
      setTimeout(() => this.nextWord(), 300);
    } else {
      this.feedbackType = 'wrong';
      this.feedback = `✗ "${this.dictionary[this.currentWord]}"`;
      this.wrongCount++;
      if (!this.wrongWords.includes(this.currentWord)) {this.wrongWords.push(this.currentWord); }
      if (!this.reviewMode && this.remainingWords.length > 0) {this.remainingWords.shift(); }
      setTimeout(() => this.nextWord(), 2000);
    }
  }

  reset(): void {
    this.correctCount = 0;
    this.wrongCount = 0;
    this.wrongWords = [];
    this.usedWords.clear();
    this.reviewMode = false;
    this.initializeWords();
    this.nextWord();
  }
  
  onKeyPress(event: KeyboardEvent): void { if (event.key === 'Enter') this.checkAnswer(); }
}
