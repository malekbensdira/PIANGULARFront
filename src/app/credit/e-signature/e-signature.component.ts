import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-e-signature',
  templateUrl: './e-signature.component.html',
  styleUrls: ['./e-signature.component.css']
})
export class ESignatureComponent implements OnInit {
  @ViewChild('signatureCanvas', { static: true }) signatureCanvas!: ElementRef<HTMLCanvasElement>;
  
  creditId: number;
  credit: any = null;
  contractGenerated: boolean = false;
  signatureData: string | null = null;
  loading: boolean = true;
  submitting: boolean = false;
  error: string = '';
  
  private ctx: CanvasRenderingContext2D | null = null;
  private drawing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private creditService: CreditService,
    private contractService: ContractService
  ) {
    this.creditId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadCredit();
    this.initSignatureCanvas();
  }

  loadCredit(): void {
    this.loading = true;
    this.creditService.getCreditById(this.creditId).subscribe({
      next: (data) => {
        this.credit = data;
        
        if (this.credit.creditStatus !== 'APPROVED') {
          this.error = 'This credit is not approved for contract signing.';
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading credit:', err);
        this.error = 'Failed to load credit data';
        this.loading = false;
      }
    });
  }

  initSignatureCanvas(): void {
    const canvas = this.signatureCanvas.nativeElement;
    this.ctx = canvas.getContext('2d');
    
    if (this.ctx) {
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = 'round';
      this.ctx.strokeStyle = '#000000';
      
      canvas.addEventListener('mousedown', this.startDrawing.bind(this));
      canvas.addEventListener('touchstart', this.startDrawing.bind(this));
      
      canvas.addEventListener('mousemove', this.draw.bind(this));
      canvas.addEventListener('touchmove', this.draw.bind(this));
      
      canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
      canvas.addEventListener('touchend', this.stopDrawing.bind(this));
      canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
    }
  }

  startDrawing(e: MouseEvent | TouchEvent): void {
    this.drawing = true;
    const { x, y } = this.getCoordinates(e);
    this.ctx?.beginPath();
    this.ctx?.moveTo(x, y);
  }

  draw(e: MouseEvent | TouchEvent): void {
    if (!this.drawing) return;
    
    const { x, y } = this.getCoordinates(e);
    this.ctx?.lineTo(x, y);
    this.ctx?.stroke();
  }

  stopDrawing(): void {
    this.drawing = false;
    this.saveSignature();
  }

  getCoordinates(e: MouseEvent | TouchEvent): { x: number, y: number } {
    const canvas = this.signatureCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    
    let x, y;
    if (e instanceof MouseEvent) {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    } else {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    }
    
    return { x, y };
  }

  clearSignature(): void {
    const canvas = this.signatureCanvas.nativeElement;
    this.ctx?.clearRect(0, 0, canvas.width, canvas.height);
    this.signatureData = null;
  }

  saveSignature(): void {
    const canvas = this.signatureCanvas.nativeElement;
    this.signatureData = canvas.toDataURL('image/png');
  }

  generateContract(): void {
    // This would generate the contract first before signing
    this.contractGenerated = true;
  }

  submitSignedContract(): void {
    if (!this.signatureData) {
      alert('Please sign the contract before submitting');
      return;
    }
    
    this.submitting = true;
    
    // Prepare data for submission
    const signedContractData = {
      creditId: this.creditId,
      signature: this.signatureData,
      timestamp: new Date().toISOString()
    };
    
    this.contractService.submitSignedContract(signedContractData).subscribe({
      next: () => {
        alert('Contract successfully signed and submitted!');
        this.router.navigate(['/credit']);
      },
      error: (err) => {
        console.error('Error submitting signed contract:', err);
        this.error = 'Failed to submit signed contract';
        this.submitting = false;
      }
    });
  }
}