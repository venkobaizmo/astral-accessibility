import { DOCUMENT, NgIf, NgClass, NgFor } from "@angular/common";
import { Component, inject, Renderer2, OnDestroy } from "@angular/core";
import { AstralCheckmarkSvgComponent } from "../util/astral-checksvg.component";
import { I18nService } from "../services/i18n.service";

interface ErrorIdentificationIssue {
  element: HTMLElement;
  issue: 'missing-labels' | 'missing-validation' | 'poor-error-message' | 'no-error-association' | 'good';
  errorType: 'form' | 'input' | 'validation' | 'message';
  description: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
}

@Component({
  selector: "astral-error-identification",
  standalone: true,
  template: `
    <button
      (click)="nextState()"
      [ngClass]="{ 'in-use': states[currentState] !== base }"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div
            class="icon action-icon"
            [ngClass]="{
              inactive: states[currentState] == base,
              active: states[currentState] != base
            }"
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 41 41"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="6" y="8" width="29" height="22" rx="2" fill="none" stroke="#FFF" stroke-width="2"/>
              <path d="M10 15 L18 15" stroke="#FFF" stroke-width="2"/>
              <path d="M10 20 L25 20" stroke="#FFF" stroke-width="2"/>
              <rect x="10" y="23" width="15" height="3" rx="1" fill="none" stroke="#FFF" stroke-width="1"/>
              <circle cx="32" cy="12" r="5" fill="#FF6B6B"/>
              <text x="29" y="16" font-family="Arial" font-size="6" fill="#FFF">!</text>
              <text x="8" y="37" font-family="Arial" font-size="5" fill="#FFF">ERROR</text>
            </svg>
          </div>

          <div class="state-dots-wrap">
            <span>{{ states[currentState] }}</span>
            <div
              class="dots"
              [ngClass]="{ inactive: states[currentState] === base }"
            >
              <div
                class="dot"
                [ngClass]="{ active: states[currentState] === 'Scan for Errors' }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: states[currentState] === 'Show Issues' }"
              ></div>
              <div
                class="dot"
                [ngClass]="{ active: states[currentState] === 'Auto-enhance' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <astral-widget-checkmark
        [isActive]="states[currentState] !== base"
      ></astral-widget-checkmark>
    </button>

    <div 
      *ngIf="showErrorPanel" 
      class="error-identification-panel"
      role="dialog"
      aria-labelledby="error-identification-title"
      [style.position]="'fixed'"
      [style.top]="'50%'"
      [style.left]="'50%'"
      [style.transform]="'translate(-50%, -50%)'"
      [style.width]="'500px'"
      [style.max-height]="'80vh'"
      [style.overflow-y]="'auto'"
      [style.background]="'white'"
      [style.border]="'2px solid #0066cc'"
      [style.border-radius]="'8px'"
      [style.padding]="'20px'"
      [style.z-index]="'999999'"
      [style.box-shadow]="'0 4px 20px rgba(0,0,0,0.3)'"
    >
      <h3 id="error-identification-title" [style.margin]="'0 0 15px 0'" [style.color]="'#333'">
        Error Identification & Enhancement
      </h3>
      
      <div [style.margin-bottom]="'20px'" [style.padding]="'12px'" [style.background]="'#f8f9fa'" [style.border-radius]="'4px'">
        <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.margin-bottom]="'8px'">
          <span><strong>Forms Found:</strong></span>
          <span>{{ formsFound }}</span>
        </div>
        <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.margin-bottom]="'8px'">
          <span><strong>Input Fields:</strong></span>
          <span>{{ inputFieldsFound }}</span>
        </div>
        <div [style.display]="'flex'" [style.justify-content]="'space-between'">
          <span><strong>Issues Found:</strong></span>
          <span>{{ getIssueCount() }}</span>
        </div>
      </div>
      
      <div *ngIf="getIssueCount() === 0" 
           [style.color]="'#28a745'" 
           [style.padding]="'15px'" 
           [style.background]="'#d4edda'" 
           [style.border-radius]="'4px'"
           [style.margin-bottom]="'15px'">
        ✓ All forms have proper error identification and validation feedback
      </div>
      
      <div *ngIf="getIssueCount() > 0">
        <h4 [style.color]="'#dc3545'" [style.margin]="'0 0 10px 0'">
          Issues Found ({{ getIssueCount() }})
        </h4>
        
        <div *ngFor="let issue of getIssuesOnly(); index as i" 
             [style.margin-bottom]="'15px'"
             [style.padding]="'12px'"
             [style.border-left]="'4px solid ' + getSeverityColor(issue.severity)"
             [style.background]="'#f8f9fa'"
             [style.border-radius]="'0 4px 4px 0'">
          
          <div [style.display]="'flex'" [style.justify-content]="'space-between'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <strong>{{ getIssueTitle(issue.issue) }}</strong>
            <div>
              <span [style.padding]="'2px 6px'" 
                    [style.border-radius]="'12px'" 
                    [style.font-size]="'11px'"
                    [style.background]="getErrorTypeColor(issue.errorType)"
                    [style.color]="'white'"
                    [style.margin-right]="'4px'">
                {{ issue.errorType.toUpperCase() }}
              </span>
              <span [style.padding]="'2px 8px'" 
                    [style.border-radius]="'12px'" 
                    [style.font-size]="'12px'"
                    [style.background]="getSeverityColor(issue.severity)"
                    [style.color]="'white'">
                {{ issue.severity.toUpperCase() }}
              </span>
            </div>
          </div>
          
          <div [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            <strong>Element:</strong> {{ getElementDescription(issue.element) }}
          </div>
          
          <div [style.margin-bottom]="'8px'" [style.font-size]="'14px'">
            {{ issue.description }}
          </div>
          
          <div [style.color]="'#666'" [style.font-size]="'14px'" [style.margin-bottom]="'8px'">
            <strong>Recommendation:</strong> {{ issue.recommendation }}
          </div>
          
          <div [style.display]="'flex'" [style.gap]="'8px'">
            <button 
              (click)="highlightElement(issue.element)"
              [style.padding]="'4px 8px'"
              [style.background]="'#0066cc'"
              [style.color]="'white'"
              [style.border]="'none'"
              [style.border-radius]="'3px'"
              [style.font-size]="'12px'"
              [style.cursor]="'pointer'"
            >
              Highlight
            </button>
            
            <button 
              (click)="enhanceErrorHandling(issue.element, issue.issue)"
              [style.padding]="'4px 8px'"
              [style.background]="'#28a745'"
              [style.color]="'white'"
              [style.border]="'none'"
              [style.border-radius]="'3px'"
              [style.font-size]="'12px'"
              [style.cursor]="'pointer'"
            >
              Auto-enhance
            </button>
          </div>
        </div>
      </div>
      
      <div [style.margin-top]="'20px'" [style.padding]="'15px'" [style.background]="'#e9ecef'" [style.border-radius]="'4px'">
        <strong>Enhancement Options:</strong>
        <div [style.margin-top]="'10px'">
          <label [style.display]="'flex'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <input 
              type="checkbox" 
              [checked]="autoValidationEnabled"
              (change)="toggleAutoValidation($event)"
              [style.margin-right]="'8px'"
            />
            Enable real-time validation feedback
          </label>
          
          <label [style.display]="'flex'" [style.align-items]="'center'" [style.margin-bottom]="'8px'">
            <input 
              type="checkbox" 
              [checked]="enhancedErrorMessagesEnabled"
              (change)="toggleEnhancedErrorMessages($event)"
              [style.margin-right]="'8px'"
            />
            Add enhanced error messages
          </label>
          
          <label [style.display]="'flex'" [style.align-items]="'center'">
            <input 
              type="checkbox" 
              [checked]="ariaEnhancementsEnabled"
              (change)="toggleAriaEnhancements($event)"
              [style.margin-right]="'8px'"
            />
            Add ARIA error associations
          </label>
        </div>
      </div>
      
      <div [style.text-align]="'right'" [style.margin-top]="'20px'">
        <button 
          (click)="rescanErrors()"
          [style.padding]="'8px 16px'"
          [style.background]="'#17a2b8'"
          [style.color]="'white'"
          [style.border]="'none'"
          [style.border-radius]="'4px'"
          [style.margin-right]="'8px'"
        >
          Re-scan
        </button>
        
        <button 
          (click)="closeErrorPanel()"
          [style.padding]="'8px 16px'"
          [style.background]="'#0066cc'"
          [style.color]="'white'"
          [style.border]="'none'"
          [style.border-radius]="'4px'"
        >
          Close
        </button>
      </div>
    </div>
  `,
  imports: [NgIf, NgClass, NgFor, AstralCheckmarkSvgComponent],
})
export class ErrorIdentificationComponent implements OnDestroy {
  constructor(
    private renderer: Renderer2,
    private i18n: I18nService
  ) {}

  document = inject(DOCUMENT);
  currentState = 0;
  base = "Error Identification";
  states = [this.base, "Scan for Errors", "Show Issues", "Auto-enhance"];
  
  errorIdentificationIssues: ErrorIdentificationIssue[] = [];
  showErrorPanel = false;
  autoValidationEnabled = false;
  enhancedErrorMessagesEnabled = false;
  ariaEnhancementsEnabled = false;
  formsFound = 0;
  inputFieldsFound = 0;
  
  private highlightedElements: HTMLElement[] = [];
  private appliedEnhancements: Map<HTMLElement, { type: string, elements: HTMLElement[] }> = new Map();
  private validationListeners: Map<HTMLElement, Function[]> = new Map();

  nextState() {
    this.currentState += 1;
    this.currentState = this.currentState % 4;
    this._runStateLogic();
  }

  private _runStateLogic() {
    this.removeHighlights();

    if (this.states[this.currentState] === "Scan for Errors") {
      this.scanForErrorIdentificationIssues();
    } else if (this.states[this.currentState] === "Show Issues") {
      this.showErrorPanel = true;
    } else if (this.states[this.currentState] === "Auto-enhance") {
      this.autoValidationEnabled = true;
      this.enhancedErrorMessagesEnabled = true;
      this.ariaEnhancementsEnabled = true;
      this.applyAllEnhancements();
      this.showErrorPanel = true;
    } else {
      this.revertAllEnhancements();
      this.autoValidationEnabled = false;
      this.enhancedErrorMessagesEnabled = false;
      this.ariaEnhancementsEnabled = false;
      this.showErrorPanel = false;
      this.errorIdentificationIssues = [];
    }
  }

  private scanForErrorIdentificationIssues() {
    this.errorIdentificationIssues = [];
    this.formsFound = 0;
    this.inputFieldsFound = 0;
    
    // Scan forms
    const forms = this.document.querySelectorAll('form') as NodeListOf<HTMLFormElement>;
    this.formsFound = forms.length;
    
    forms.forEach(form => {
      if (form.closest('astral-accessibility')) return;
      
      this.analyzeForm(form);
    });

    // Scan individual input fields (might not be in forms)
    const inputs = this.document.querySelectorAll('input, select, textarea') as NodeListOf<HTMLElement>;
    this.inputFieldsFound = inputs.length;
    
    inputs.forEach(input => {
      if (input.closest('astral-accessibility')) return;
      if (input.closest('form')) return; // Already analyzed as part of form
      
      this.analyzeInputField(input);
    });

    this.showErrorPanel = true;
    this.announceResults();
  }

  private analyzeForm(form: HTMLFormElement) {
    // Check for form-level error handling
    const hasFormErrorContainer = form.querySelector('[role="alert"], .error-summary, .form-errors, [aria-live]');
    
    if (!hasFormErrorContainer) {
      this.errorIdentificationIssues.push({
        element: form,
        issue: 'missing-validation',
        errorType: 'form',
        description: 'Form lacks a central error message container for validation feedback.',
        recommendation: 'Add a container with role="alert" or aria-live="polite" to announce form-wide errors.',
        severity: 'medium'
      });
    }

    // Analyze form fields
    const formInputs = form.querySelectorAll('input, select, textarea') as NodeListOf<HTMLElement>;
    formInputs.forEach(input => {
      this.analyzeInputField(input);
    });
  }

  private analyzeInputField(input: HTMLElement) {
    const inputType = input.getAttribute('type') || input.tagName.toLowerCase();
    const isRequired = input.hasAttribute('required') || input.getAttribute('aria-required') === 'true';
    
    // Check for labels
    const hasLabel = this.checkForLabel(input);
    if (!hasLabel) {
      this.errorIdentificationIssues.push({
        element: input,
        issue: 'missing-labels',
        errorType: 'input',
        description: 'Input field lacks a proper label or accessible name.',
        recommendation: 'Add a <label> element with for attribute, or use aria-label/aria-labelledby.',
        severity: 'high'
      });
    }

    // Check for error message association
    const hasErrorAssociation = this.checkForErrorAssociation(input);
    if (!hasErrorAssociation && isRequired) {
      this.errorIdentificationIssues.push({
        element: input,
        issue: 'no-error-association',
        errorType: 'validation',
        description: 'Required field lacks proper error message association.',
        recommendation: 'Use aria-describedby to associate error messages with the input field.',
        severity: 'high'
      });
    }

    // Check for validation feedback mechanisms
    const hasValidationFeedback = this.checkForValidationFeedback(input);
    if (!hasValidationFeedback && this.needsValidation(input)) {
      this.errorIdentificationIssues.push({
        element: input,
        issue: 'missing-validation',
        errorType: 'validation',
        description: 'Input field lacks validation feedback mechanisms.',
        recommendation: 'Add invalid/valid states with aria-invalid and descriptive error messages.',
        severity: 'medium'
      });
    }

    // Check existing error messages quality
    this.checkErrorMessageQuality(input);
  }

  private checkForLabel(input: HTMLElement): boolean {
    const id = input.id;
    
    // Check for explicit label with for attribute
    if (id) {
      const label = this.document.querySelector(`label[for="${id}"]`);
      if (label) return true;
    }
    
    // Check for wrapping label
    const parentLabel = input.closest('label');
    if (parentLabel) return true;
    
    // Check for aria-label or aria-labelledby
    if (input.getAttribute('aria-label') || input.getAttribute('aria-labelledby')) {
      return true;
    }
    
    // Check for title attribute (not ideal but provides some labeling)
    if (input.getAttribute('title')) {
      return true;
    }
    
    return false;
  }

  private checkForErrorAssociation(input: HTMLElement): boolean {
    const describedBy = input.getAttribute('aria-describedby');
    if (!describedBy) return false;
    
    const ids = describedBy.split(/\s+/);
    return ids.some(id => {
      const element = this.document.getElementById(id);
      return element && (
        element.textContent?.toLowerCase().includes('error') ||
        element.classList.contains('error') ||
        element.getAttribute('role') === 'alert'
      );
    });
  }

  private checkForValidationFeedback(input: HTMLElement): boolean {
    // Check for existing validation attributes or mechanisms
    return !!(
      input.getAttribute('pattern') ||
      input.getAttribute('min') ||
      input.getAttribute('max') ||
      input.getAttribute('minlength') ||
      input.getAttribute('maxlength') ||
      input.getAttribute('step') ||
      input.getAttribute('aria-invalid') ||
      this.hasValidationListeners(input)
    );
  }

  private hasValidationListeners(input: HTMLElement): boolean {
    // Check if element has validation event listeners (simplified check)
    const events = ['input', 'blur', 'change', 'invalid'];
    return events.some(event => {
      const listeners = (input as any)[`on${event}`];
      return listeners !== null && listeners !== undefined;
    });
  }

  private needsValidation(input: HTMLElement): boolean {
    const type = input.getAttribute('type') || input.tagName.toLowerCase();
    const isRequired = input.hasAttribute('required');
    
    // Input types that typically need validation
    const validationTypes = ['email', 'url', 'tel', 'number', 'password', 'date', 'time'];
    
    return isRequired || validationTypes.includes(type) || input.tagName.toLowerCase() === 'textarea';
  }

  private checkErrorMessageQuality(input: HTMLElement) {
    const describedBy = input.getAttribute('aria-describedby');
    if (!describedBy) return;
    
    const ids = describedBy.split(/\s+/);
    ids.forEach(id => {
      const errorElement = this.document.getElementById(id);
      if (errorElement && this.isErrorMessage(errorElement)) {
        const errorText = errorElement.textContent?.trim();
        
        if (!errorText || this.isPoorErrorMessage(errorText)) {
          this.errorIdentificationIssues.push({
            element: errorElement,
            issue: 'poor-error-message',
            errorType: 'message',
            description: 'Error message is unclear or not helpful.',
            recommendation: 'Provide specific, actionable error messages that explain what went wrong and how to fix it.',
            severity: 'medium'
          });
        }
      }
    });
  }

  private isErrorMessage(element: HTMLElement): boolean {
    return !!(
      element.classList.contains('error') ||
      element.classList.contains('invalid') ||
      element.getAttribute('role') === 'alert' ||
      element.textContent?.toLowerCase().includes('error') ||
      element.textContent?.toLowerCase().includes('invalid')
    );
  }

  private isPoorErrorMessage(message: string): boolean {
    const poorPatterns = [
      /^error$/i,
      /^invalid$/i,
      /^wrong$/i,
      /^incorrect$/i,
      /^bad$/i,
      /^no$/i,
      /^required$/i
    ];
    
    return poorPatterns.some(pattern => pattern.test(message.trim())) || message.length < 5;
  }

  enhanceErrorHandling(element: HTMLElement, issueType: string) {
    switch (issueType) {
      case 'missing-labels':
        this.addLabel(element);
        break;
      case 'missing-validation':
        this.addValidation(element);
        break;
      case 'no-error-association':
        this.addErrorAssociation(element);
        break;
      case 'poor-error-message':
        this.improveErrorMessage(element);
        break;
    }
  }

  private addLabel(input: HTMLElement) {
    if (this.appliedEnhancements.has(input)) return;
    
    const fieldName = this.getFieldName(input);
    const label = this.renderer.createElement('label');
    
    // Generate unique ID if needed
    if (!input.id) {
      const id = `astral-field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.renderer.setAttribute(input, 'id', id);
    }
    
    this.renderer.setAttribute(label, 'for', input.id);
    this.renderer.setProperty(label, 'textContent', fieldName);
    this.renderer.setStyle(label, 'display', 'block');
    this.renderer.setStyle(label, 'margin-bottom', '4px');
    this.renderer.setStyle(label, 'font-weight', 'bold');
    
    // Insert label before the input
    this.renderer.insertBefore(input.parentNode!, label, input);
    
    this.appliedEnhancements.set(input, { type: 'label', elements: [label] });
    this.announceToScreenReader(`Added label for ${fieldName} field`);
  }

  private addValidation(input: HTMLElement) {
    const existingEnhancement = this.appliedEnhancements.get(input);
    const errorContainer = this.createOrGetErrorContainer(input);
    
    const listeners: Function[] = [];
    
    // Add input validation listener
    const inputListener = (e: Event) => {
      this.validateField(input, errorContainer);
    };
    
    const blurListener = (e: Event) => {
      this.validateField(input, errorContainer);
    };
    
    input.addEventListener('input', inputListener as EventListener);
    input.addEventListener('blur', blurListener as EventListener);
    
    listeners.push(inputListener, blurListener);
    this.validationListeners.set(input, listeners);
    
    // Set up ARIA attributes
    this.renderer.setAttribute(input, 'aria-invalid', 'false');
    
    const elements = existingEnhancement ? [...existingEnhancement.elements, errorContainer] : [errorContainer];
    this.appliedEnhancements.set(input, { type: 'validation', elements });
    
    this.announceToScreenReader('Added validation feedback for field');
  }

  private addErrorAssociation(input: HTMLElement) {
    const errorContainer = this.createOrGetErrorContainer(input);
    
    // Associate error container with input
    const currentDescribedBy = input.getAttribute('aria-describedby') || '';
    const newDescribedBy = currentDescribedBy ? 
      `${currentDescribedBy} ${errorContainer.id}` : errorContainer.id;
    
    this.renderer.setAttribute(input, 'aria-describedby', newDescribedBy);
    
    const existingEnhancement = this.appliedEnhancements.get(input);
    const elements = existingEnhancement ? [...existingEnhancement.elements, errorContainer] : [errorContainer];
    this.appliedEnhancements.set(input, { type: 'association', elements });
    
    this.announceToScreenReader('Added error message association');
  }

  private improveErrorMessage(errorElement: HTMLElement) {
    const currentText = errorElement.textContent?.trim() || '';
    const associatedInput = this.findAssociatedInput(errorElement);
    
    let improvedMessage = currentText;
    
    if (associatedInput) {
      const fieldName = this.getFieldName(associatedInput);
      const inputType = associatedInput.getAttribute('type') || associatedInput.tagName.toLowerCase();
      
      // Generate more helpful error messages
      if (currentText.toLowerCase().includes('required')) {
        improvedMessage = `${fieldName} is required. Please provide a value.`;
      } else if (currentText.toLowerCase().includes('invalid') || currentText.toLowerCase().includes('error')) {
        switch (inputType) {
          case 'email':
            improvedMessage = `Please enter a valid email address for ${fieldName} (e.g., user@example.com).`;
            break;
          case 'url':
            improvedMessage = `Please enter a valid URL for ${fieldName} (e.g., https://example.com).`;
            break;
          case 'tel':
            improvedMessage = `Please enter a valid phone number for ${fieldName}.`;
            break;
          case 'number':
            improvedMessage = `Please enter a valid number for ${fieldName}.`;
            break;
          default:
            improvedMessage = `Please check the format of ${fieldName} and try again.`;
        }
      }
    }
    
    if (improvedMessage !== currentText) {
      this.renderer.setProperty(errorElement, 'textContent', improvedMessage);
      this.appliedEnhancements.set(errorElement, { type: 'message', elements: [errorElement] });
      this.announceToScreenReader('Improved error message clarity');
    }
  }

  private createOrGetErrorContainer(input: HTMLElement): HTMLElement {
    // Check if error container already exists
    const describedBy = input.getAttribute('aria-describedby');
    if (describedBy) {
      const ids = describedBy.split(/\s+/);
      for (const id of ids) {
        const existing = this.document.getElementById(id);
        if (existing && this.isErrorMessage(existing)) {
          return existing;
        }
      }
    }
    
    // Create new error container
    const errorContainer = this.renderer.createElement('div');
    const errorId = `astral-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.renderer.setAttribute(errorContainer, 'id', errorId);
    this.renderer.setAttribute(errorContainer, 'role', 'alert');
    this.renderer.setAttribute(errorContainer, 'aria-live', 'polite');
    this.renderer.setStyle(errorContainer, 'color', '#dc3545');
    this.renderer.setStyle(errorContainer, 'font-size', '14px');
    this.renderer.setStyle(errorContainer, 'margin-top', '4px');
    this.renderer.setStyle(errorContainer, 'display', 'none');
    
    // Insert after the input
    this.renderer.insertBefore(input.parentNode!, errorContainer, input.nextSibling);
    
    return errorContainer;
  }

  private validateField(input: HTMLElement, errorContainer: HTMLElement) {
    const value = (input as HTMLInputElement).value?.trim() || '';
    const isRequired = input.hasAttribute('required');
    const inputType = input.getAttribute('type') || input.tagName.toLowerCase();
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (isRequired && !value) {
      isValid = false;
      errorMessage = `${this.getFieldName(input)} is required.`;
    }
    // Type-specific validation
    else if (value) {
      switch (inputType) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
          }
          break;
        case 'url':
          try {
            new URL(value);
          } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL.';
          }
          break;
        case 'tel':
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            isValid = false;
            errorMessage = 'Please enter a valid number.';
          }
          break;
      }
    }
    
    // Update field state
    this.renderer.setAttribute(input, 'aria-invalid', isValid ? 'false' : 'true');
    
    if (isValid) {
      this.renderer.setStyle(errorContainer, 'display', 'none');
      this.renderer.setProperty(errorContainer, 'textContent', '');
    } else {
      this.renderer.setStyle(errorContainer, 'display', 'block');
      this.renderer.setProperty(errorContainer, 'textContent', errorMessage);
    }
  }

  private findAssociatedInput(errorElement: HTMLElement): HTMLElement | null {
    // Find input that is described by this error element
    const errorId = errorElement.id;
    if (!errorId) return null;
    
    const inputs = this.document.querySelectorAll('[aria-describedby]') as NodeListOf<HTMLElement>;
    for (const input of inputs) {
      const describedBy = input.getAttribute('aria-describedby') || '';
      if (describedBy.split(/\s+/).includes(errorId)) {
        return input;
      }
    }
    
    return null;
  }

  private getFieldName(input: HTMLElement): string {
    // Try to get a meaningful field name
    const name = input.getAttribute('name') || input.getAttribute('id') || '';
    const placeholder = input.getAttribute('placeholder') || '';
    const label = input.closest('label')?.textContent?.trim() || '';
    
    if (label) return label;
    if (placeholder) return placeholder;
    if (name) return name.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return 'This field';
  }

  private applyAllEnhancements() {
    const issuesOnly = this.getIssuesOnly();
    let enhancedCount = 0;
    
    issuesOnly.forEach(issue => {
      this.enhanceErrorHandling(issue.element, issue.issue);
      enhancedCount++;
    });

    if (enhancedCount > 0) {
      this.announceToScreenReader(`Applied enhancements to ${enhancedCount} form element${enhancedCount === 1 ? '' : 's'}`);
    }
  }

  private revertAllEnhancements() {
    this.appliedEnhancements.forEach((enhancement, element) => {
      enhancement.elements.forEach(enhancementElement => {
        if (enhancementElement.parentNode) {
          this.renderer.removeChild(enhancementElement.parentNode, enhancementElement);
        }
      });
    });
    
    // Remove validation listeners
    this.validationListeners.forEach((listeners, element) => {
      listeners.forEach(listener => {
        element.removeEventListener('input', listener as EventListener);
        element.removeEventListener('blur', listener as EventListener);
      });
    });
    
    this.appliedEnhancements.clear();
    this.validationListeners.clear();
    
    this.announceToScreenReader('Reverted all error handling enhancements');
  }

  toggleAutoValidation(event: Event) {
    const target = event.target as HTMLInputElement;
    this.autoValidationEnabled = target.checked;
    
    this.announceToScreenReader(
      this.autoValidationEnabled ? 'Auto-validation enabled' : 'Auto-validation disabled'
    );
  }

  toggleEnhancedErrorMessages(event: Event) {
    const target = event.target as HTMLInputElement;
    this.enhancedErrorMessagesEnabled = target.checked;
    
    this.announceToScreenReader(
      this.enhancedErrorMessagesEnabled ? 'Enhanced error messages enabled' : 'Enhanced error messages disabled'
    );
  }

  toggleAriaEnhancements(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ariaEnhancementsEnabled = target.checked;
    
    this.announceToScreenReader(
      this.ariaEnhancementsEnabled ? 'ARIA enhancements enabled' : 'ARIA enhancements disabled'
    );
  }

  highlightElement(element: HTMLElement) {
    this.removeHighlights();
    
    const highlight = this.renderer.createElement('div');
    this.renderer.setStyle(highlight, 'position', 'absolute');
    this.renderer.setStyle(highlight, 'border', '3px solid #dc3545');
    this.renderer.setStyle(highlight, 'background', 'rgba(220, 53, 69, 0.1)');
    this.renderer.setStyle(highlight, 'pointer-events', 'none');
    this.renderer.setStyle(highlight, 'z-index', '999998');
    this.renderer.setStyle(highlight, 'border-radius', '4px');
    
    const rect = element.getBoundingClientRect();
    this.renderer.setStyle(highlight, 'top', `${rect.top + window.scrollY - 3}px`);
    this.renderer.setStyle(highlight, 'left', `${rect.left + window.scrollX - 3}px`);
    this.renderer.setStyle(highlight, 'width', `${rect.width + 6}px`);
    this.renderer.setStyle(highlight, 'height', `${rect.height + 6}px`);
    
    this.renderer.appendChild(this.document.body, highlight);
    this.highlightedElements.push(highlight);
    
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove highlight after 5 seconds
    setTimeout(() => {
      this.removeHighlights();
    }, 5000);
  }

  private removeHighlights() {
    this.highlightedElements.forEach(highlight => {
      if (highlight.parentNode) {
        this.renderer.removeChild(this.document.body, highlight);
      }
    });
    this.highlightedElements = [];
  }

  rescanErrors() {
    this.scanForErrorIdentificationIssues();
    this.announceToScreenReader('Re-scanned forms for error identification issues');
  }

  getIssuesOnly(): ErrorIdentificationIssue[] {
    return this.errorIdentificationIssues.filter(issue => issue.issue !== 'good');
  }

  getIssueCount(): number {
    return this.getIssuesOnly().length;
  }

  getIssueTitle(issue: string): string {
    switch (issue) {
      case 'missing-labels': return 'Missing Field Labels';
      case 'missing-validation': return 'Missing Validation Feedback';
      case 'poor-error-message': return 'Poor Error Message';
      case 'no-error-association': return 'No Error Association';
      case 'good': return 'Proper Error Handling';
      default: return 'Unknown Issue';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#17a2b8';
      default: return '#6c757d';
    }
  }

  getErrorTypeColor(type: string): string {
    switch (type) {
      case 'form': return '#6f42c1';
      case 'input': return '#fd7e14';
      case 'validation': return '#20c997';
      case 'message': return '#e83e8c';
      default: return '#6c757d';
    }
  }

  getElementDescription(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const name = element.getAttribute('name') ? `[name="${element.getAttribute('name')}"]` : '';
    const type = element.getAttribute('type') ? `[type="${element.getAttribute('type')}"]` : '';
    const className = element.className ? `.${element.className.split(' ')[0]}` : '';
    
    return `<${tagName}>${id}${name}${type}${className}`;
  }

  closeErrorPanel() {
    this.showErrorPanel = false;
    this.currentState = 0;
    this.removeHighlights();
  }

  private announceResults() {
    const issueCount = this.getIssueCount();
    
    const message = issueCount === 0 
      ? `Analyzed ${this.formsFound} form${this.formsFound === 1 ? '' : 's'} and ${this.inputFieldsFound} input field${this.inputFieldsFound === 1 ? '' : 's'} - no error identification issues found`
      : `Found ${issueCount} error identification issue${issueCount === 1 ? '' : 's'} across ${this.formsFound} form${this.formsFound === 1 ? '' : 's'} and ${this.inputFieldsFound} input field${this.inputFieldsFound === 1 ? '' : 's'}`;
    
    this.announceToScreenReader(message);
  }

  private announceToScreenReader(message: string) {
    const announcement = this.renderer.createElement('div');
    this.renderer.setAttribute(announcement, 'aria-live', 'polite');
    this.renderer.setAttribute(announcement, 'aria-atomic', 'true');
    this.renderer.setStyle(announcement, 'position', 'absolute');
    this.renderer.setStyle(announcement, 'left', '-10000px');
    this.renderer.setProperty(announcement, 'textContent', message);
    this.renderer.appendChild(this.document.body, announcement);
    
    setTimeout(() => {
      this.renderer.removeChild(this.document.body, announcement);
    }, 1000);
  }

  ngOnDestroy() {
    this.revertAllEnhancements();
    this.removeHighlights();
    this.showErrorPanel = false;
  }
}
