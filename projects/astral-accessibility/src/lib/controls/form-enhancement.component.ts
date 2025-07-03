import { Component, OnInit, Renderer2, OnDestroy, Optional, SkipSelf } from "@angular/core";
import { NgIf, NgClass } from "@angular/common";
import { IzmoCheckmarkSvgComponent } from "../util/izmo-checksvg.component";
import { I18nService } from "../services/i18n.service";
import { IzmoAccessibilityComponent } from "../izmo-accessibility.component";

@Component({
  selector: "izmo-form-enhancement",
  standalone: true,
  template: `
    <button
      (click)="toggle()"
      [ngClass]="{ 'in-use': isActive }"
      [attr.aria-label]="isActive ? 'Disable form accessibility enhancements' : 'Enable form accessibility enhancements'"
      [attr.aria-pressed]="isActive"
    >
      <div class="title">
        <div class="icon-state-wrap">
          <div class="icon action-icon" [ngClass]="{ inactive: !isActive, active: isActive }">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <circle cx="17" cy="16" r="2" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="L16 17L17 18L19 16" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="state-dots-wrap">
            <span>{{ i18n.getTranslation('form-enhancement') }}</span>
          </div>
        </div>
      </div>
      <izmo-widget-checkmark [isActive]="isActive"></izmo-widget-checkmark>
    </button>
  `,
  imports: [NgIf, NgClass, IzmoCheckmarkSvgComponent],
})
export class FormEnhancementComponent implements OnInit, OnDestroy {
  isActive = false;
  private styleElement?: HTMLStyleElement;
  private observer?: MutationObserver;
  private enhancedElements = new Set<HTMLElement>();

  constructor(
    private renderer: Renderer2,
    public i18n: I18nService,
    @Optional() @SkipSelf() private parent?: IzmoAccessibilityComponent
  ) {
    if (this.parent) {
      this.parent.resetEvent.subscribe(() => this.reset());
    }
  }

  ngOnInit() {
    this.isActive = document.querySelector('.izmo-form-enhancement-styles') !== null;
    if (this.isActive) {
      this.enhanceAllForms();
    }
  }

  ngOnDestroy() {
    this.removeFormEnhancements();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  toggle() {
    if (this.isActive) {
      this.removeFormEnhancements();
    } else {
      this.applyFormEnhancements();
    }
    this.isActive = !this.isActive;
    this.announceChange();
  }

  private applyFormEnhancements() {
    this.createStyles();
    this.enhanceAllForms();
    this.startObservingDOMChanges();
  }

  private createStyles() {
    this.styleElement = this.renderer.createElement('style');
    this.renderer.addClass(this.styleElement, 'izmo-form-enhancement-styles');
    
    const css = `
      /* Enhanced form field visibility */
      .izmo-required-field::after {
        content: " *";
        color: #d73527;
        font-weight: bold;
        font-size: 1.2em;
      }
      
      .izmo-field-error {
        border: 2px solid #d73527 !important;
        background-color: #fdf2f2 !important;
      }
      
      .izmo-error-message {
        color: #d73527;
        font-size: 0.9em;
        margin-top: 4px;
        display: block;
        font-weight: 500;
      }
      
      .izmo-field-help {
        color: #666;
        font-size: 0.9em;
        margin-top: 4px;
        display: block;
      }
      
      .izmo-enhanced-label {
        font-weight: 600 !important;
        color: #333 !important;
        margin-bottom: 4px !important;
        display: block !important;
      }
      
      .izmo-form-group {
        margin-bottom: 20px !important;
        position: relative;
      }
      
      /* Enhanced focus styles for form elements */
      input:focus, textarea:focus, select:focus {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.2) !important;
      }
      
      /* Invalid field styles */
      input:invalid, textarea:invalid, select:invalid {
        border-color: #d73527 !important;
      }
      
      /* Success state */
      .izmo-field-success {
        border: 2px solid #28a745 !important;
        background-color: #f8fff9 !important;
      }
      
      .izmo-success-message {
        color: #28a745;
        font-size: 0.9em;
        margin-top: 4px;
        display: block;
        font-weight: 500;
      }
    `;
    
    this.renderer.setProperty(this.styleElement, 'textContent', css);
    this.renderer.appendChild(document.head, this.styleElement);
  }

  private enhanceAllForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => this.enhanceForm(form as HTMLFormElement));
    
    // Also enhance standalone form fields
    const standaloneFields = document.querySelectorAll('input:not(form input), textarea:not(form textarea), select:not(form select)');
    standaloneFields.forEach(field => this.enhanceFormField(field as HTMLElement));
  }

  private enhanceForm(form: HTMLFormElement) {
    if (this.enhancedElements.has(form)) return;
    
    // Add form validation enhancement
    form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
    
    // Enhance all form fields
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => this.enhanceFormField(field as HTMLElement));
    
    this.enhancedElements.add(form);
  }

  private enhanceFormField(field: HTMLElement) {
    if (this.enhancedElements.has(field)) return;
    
    const input = field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const fieldContainer = this.createOrGetFieldContainer(field);
    
    // Enhance labels
    this.enhanceFieldLabel(field);
    
    // Add required indicator
    if (input.required || input.getAttribute('aria-required') === 'true') {
      this.addRequiredIndicator(field);
    }
    
    // Add help text if title attribute exists
    if (field.title) {
      this.addHelpText(field, field.title);
    }
    
    // Add real-time validation
    input.addEventListener('blur', () => this.validateField(field));
    input.addEventListener('input', () => this.clearFieldError(field));
    
    // Enhance with proper ARIA attributes
    this.enhanceFieldAria(field);
    
    this.enhancedElements.add(field);
  }

  private createOrGetFieldContainer(field: HTMLElement): HTMLElement {
    let container = field.closest('.izmo-form-group');
    if (!container) {
      container = this.renderer.createElement('div');
      this.renderer.addClass(container, 'izmo-form-group');
      
      if (field.parentNode) {
        this.renderer.insertBefore(field.parentNode, container, field);
        this.renderer.appendChild(container, field);
      }
    }
    return container as HTMLElement;
  }

  private enhanceFieldLabel(field: HTMLElement) {
    let label = this.findLabelForField(field);
    if (label) {
      this.renderer.addClass(label, 'izmo-enhanced-label');
    } else {
      // Create label if none exists and field has placeholder or name
      const input = field as HTMLInputElement;
      const labelText = input.placeholder || input.name || 'Form field';
      if (labelText && labelText !== 'Form field') {
        label = this.renderer.createElement('label');
        this.renderer.addClass(label, 'izmo-enhanced-label');
        this.renderer.setProperty(label, 'textContent', labelText);
        this.renderer.setAttribute(label, 'for', input.id || this.generateId(input));
        
        const container = this.createOrGetFieldContainer(field);
        this.renderer.insertBefore(container, label, field);
      }
    }
  }

  private findLabelForField(field: HTMLElement): HTMLLabelElement | null {
    const input = field as HTMLInputElement;
    
    // Look for label with for attribute
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) return label as HTMLLabelElement;
    }
    
    // Look for wrapping label
    const wrappingLabel = field.closest('label');
    if (wrappingLabel) return wrappingLabel as HTMLLabelElement;
    
    // Look for adjacent label
    const prevSibling = field.previousElementSibling;
    if (prevSibling && prevSibling.tagName === 'LABEL') {
      return prevSibling as HTMLLabelElement;
    }
    
    return null;
  }

  private addRequiredIndicator(field: HTMLElement) {
    const label = this.findLabelForField(field);
    if (label && !label.classList.contains('izmo-required-field')) {
      this.renderer.addClass(label, 'izmo-required-field');
    }
  }

  private addHelpText(field: HTMLElement, helpText: string) {
    const container = this.createOrGetFieldContainer(field);
    const helpElement = this.renderer.createElement('span');
    this.renderer.addClass(helpElement, 'izmo-field-help');
    this.renderer.setProperty(helpElement, 'textContent', helpText);
    
    const helpId = `help-${this.generateId(field)}`;
    this.renderer.setAttribute(helpElement, 'id', helpId);
    this.renderer.appendChild(container, helpElement);
    
    // Link field to help text
    this.renderer.setAttribute(field, 'aria-describedby', helpId);
  }

  private enhanceFieldAria(field: HTMLElement) {
    const input = field as HTMLInputElement;
    
    // Ensure field has proper labels
    if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      const label = this.findLabelForField(field);
      if (label && label.id) {
        this.renderer.setAttribute(field, 'aria-labelledby', label.id);
      } else if (label) {
        const labelId = `label-${this.generateId(field)}`;
        this.renderer.setAttribute(label, 'id', labelId);
        this.renderer.setAttribute(field, 'aria-labelledby', labelId);
      }
    }
    
    // Add aria-invalid for validation
    if (!input.getAttribute('aria-invalid')) {
      this.renderer.setAttribute(field, 'aria-invalid', 'false');
    }
  }

  private validateField(field: HTMLElement) {
    const input = field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const isValid = input.checkValidity();
    
    this.clearFieldError(field);
    
    if (!isValid) {
      this.showFieldError(field, input.validationMessage);
    } else {
      this.showFieldSuccess(field);
    }
  }

  private showFieldError(field: HTMLElement, message: string) {
    this.renderer.addClass(field, 'izmo-field-error');
    this.renderer.setAttribute(field, 'aria-invalid', 'true');
    
    const container = this.createOrGetFieldContainer(field);
    const errorElement = this.renderer.createElement('span');
    this.renderer.addClass(errorElement, 'izmo-error-message');
    this.renderer.setProperty(errorElement, 'textContent', message);
    this.renderer.setAttribute(errorElement, 'role', 'alert');
    
    const errorId = `error-${this.generateId(field)}`;
    this.renderer.setAttribute(errorElement, 'id', errorId);
    this.renderer.appendChild(container, errorElement);
    
    // Update aria-describedby
    const currentDescribedBy = field.getAttribute('aria-describedby') || '';
    const newDescribedBy = currentDescribedBy ? `${currentDescribedBy} ${errorId}` : errorId;
    this.renderer.setAttribute(field, 'aria-describedby', newDescribedBy);
  }

  private showFieldSuccess(field: HTMLElement) {
    this.renderer.addClass(field, 'izmo-field-success');
    this.renderer.setAttribute(field, 'aria-invalid', 'false');
  }

  private clearFieldError(field: HTMLElement) {
    this.renderer.removeClass(field, 'izmo-field-error');
    this.renderer.removeClass(field, 'izmo-field-success');
    
    const container = this.createOrGetFieldContainer(field);
    const errorMessages = container.querySelectorAll('.izmo-error-message');
    errorMessages.forEach(error => this.renderer.removeChild(container, error));
    
    // Clean up aria-describedby
    const describedBy = field.getAttribute('aria-describedby');
    if (describedBy) {
      const cleanedDescribedBy = describedBy
        .split(' ')
        .filter(id => !id.startsWith('error-'))
        .join(' ');
      
      if (cleanedDescribedBy) {
        this.renderer.setAttribute(field, 'aria-describedby', cleanedDescribedBy);
      } else {
        this.renderer.removeAttribute(field, 'aria-describedby');
      }
    }
  }

  private handleFormSubmit(event: Event, form: HTMLFormElement) {
    const fields = form.querySelectorAll('input, textarea, select');
    let hasErrors = false;
    
    fields.forEach(field => {
      this.validateField(field as HTMLElement);
      if (!(field as HTMLInputElement).checkValidity()) {
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      event.preventDefault();
      this.announceMessage('Form contains errors. Please review and correct them.');
      
      // Focus first error field
      const firstErrorField = form.querySelector('.izmo-field-error') as HTMLElement;
      if (firstErrorField) {
        firstErrorField.focus();
      }
    }
  }

  private generateId(element: HTMLElement): string {
    if (element.id) return element.id;
    
    const id = `izmo-field-${Math.random().toString(36).substr(2, 9)}`;
    this.renderer.setAttribute(element, 'id', id);
    return id;
  }

  private startObservingDOMChanges() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            // Check for new forms
            if (element.tagName === 'FORM') {
              this.enhanceForm(element as HTMLFormElement);
            }
            
            // Check for new form fields
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
              this.enhanceFormField(element);
            }
            
            // Check for new forms/fields within added elements
            const newForms = element.querySelectorAll('form');
            newForms.forEach(form => this.enhanceForm(form as HTMLFormElement));
            
            const newFields = element.querySelectorAll('input, textarea, select');
            newFields.forEach(field => this.enhanceFormField(field as HTMLElement));
          }
        });
      });
    });
    
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private removeFormEnhancements() {
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
      this.styleElement = undefined;
    }
    
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
    
    // Remove enhancement classes and attributes
    this.enhancedElements.forEach(element => {
      this.renderer.removeClass(element, 'izmo-field-error');
      this.renderer.removeClass(element, 'izmo-field-success');
      this.renderer.removeClass(element, 'izmo-required-field');
      this.renderer.removeClass(element, 'izmo-enhanced-label');
    });
    
    // Remove error messages
    const errorMessages = document.querySelectorAll('.izmo-error-message');
    errorMessages.forEach(error => {
      if (error.parentNode) {
        this.renderer.removeChild(error.parentNode, error);
      }
    });
    
    this.enhancedElements.clear();
  }

  private announceChange() {
    const message = this.isActive ? 
      'Form accessibility enhancements enabled' : 
      'Form accessibility enhancements disabled';
    this.announceMessage(message);
  }

  private announceMessage(message: string) {
    const announcement = this.renderer.createElement('div');
    this.renderer.setAttribute(announcement, 'aria-live', 'polite');
    this.renderer.setAttribute(announcement, 'aria-atomic', 'true');
    this.renderer.setStyle(announcement, 'position', 'absolute');
    this.renderer.setStyle(announcement, 'left', '-10000px');
    this.renderer.setProperty(announcement, 'textContent', message);
    this.renderer.appendChild(document.body, announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        this.renderer.removeChild(document.body, announcement);
      }
    }, 1000);
  }

  reset() {
    if (this.isActive) {
      this.removeFormEnhancements();
      this.isActive = false;
    }
  }
}
