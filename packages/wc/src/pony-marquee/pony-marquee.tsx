import { Component, Prop, h, State, Watch } from '@stencil/core';

type Status = 'preparing' | 'paused' | 'playing'

@Component({
  tag: 'pony-marquee',
  styleUrl: 'pony-marquee.css',
  shadow: true,
})
export class PonyMarquee {
  @Prop() text: string = '';

  @Watch('text')
  watchText() {
    this.status = 'preparing'
  }

  @Prop() autoDetection: boolean = false;

  @Watch('autoDetection')
  watchAutoDetection() {
    this.status = 'preparing'
  }

  @Prop() delay: number = 0;

  @Prop() direction: 'ltr' | 'rtl' = 'rtl';

  @Prop() speed: number = 20;

  @Watch('speed')
  watchSpeed() {
    this.updateDuration()
  }

  @Prop() gutter: number = 32;

  @Prop() loop: number = Infinity;

  @Prop() pauseOnHover: boolean = true;

  @State() status: Status = this.autoDetection ? 'preparing' : 'playing';

  @State() duration: number;

  private initialized = false;

  private marqueeRef: HTMLDivElement;

  private contentRef: HTMLDivElement;

  private resizeObserver: ResizeObserver;

  componentDidLoad() {
    this.updateDuration()
    if (this.status === 'preparing') {
      this.prepareMarquee()
    }
    this.resizeObserver = new ResizeObserver(() => {
      if (!this.initialized) {
        this.initialized = true
        return
      }
      this.status = 'preparing'
    })
    this.resizeObserver.observe(this.marqueeRef)
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect()
  }

  componentDidUpdate() {
    if (this.status === 'preparing') {
      this.updateDuration()
      this.prepareMarquee()
    }
  }

  private updateDuration() {
    this.duration = Math.max(this.marqueeRef.clientWidth, this.contentRef.clientWidth) / this.speed
  }

  private prepareMarquee() {
    if (this.autoDetection) {
      this.status = this.contentRef.scrollWidth > this.marqueeRef.clientWidth ? 'playing' : 'paused'
    } else {
      this.status = 'playing'
    }
  }

  private getAnimationStyle() {
    const animationDelay = `${this.delay}ms`
    const animationDirection = this.direction === 'rtl' ? 'normal' : 'reverse'
    const animationDuration = `${this.duration}s`
    const animationIterationCount = this.loop === Infinity ? 'infinite' : String(this.loop)
    return {
      animationDelay,
      MozAnimationDelay: animationDelay,
      WebkitAnimationDelay: animationDelay,
      OAnimationDelay: animationDelay,
      animationDirection,
      MozAnimationDirection: animationDirection,
      WebkitAnimationDirection: animationDirection,
      OAnimationDirection: animationDirection,
      animationDuration,
      MozAnimationDuration: animationDuration,
      WebkitAnimationDuration: animationDuration,
      OAnimationDuration: animationDuration,
      animationIterationCount,
      MozAnimationIterationCount: animationIterationCount,
      WebkitAnimationIterationCount: animationIterationCount,
      OAnimationIterationCount: animationIterationCount,
    }
  }

  private getGutterStyle() {
    return { paddingRight: `${this.gutter}px` }
  }

  render() {
    const style = {
      ...this.getAnimationStyle(),
      ...this.getGutterStyle(),
    }

    return (
      <div
        class={{
          'marquee': true,
          'playing': this.status === 'playing',
          'paused': this.status !== 'playing',
          'pause-on-hover': this.pauseOnHover,
        }}
        ref={(elm: HTMLDivElement) => this.marqueeRef = elm}
      >
        <div
          style={style}
          ref={(elm: HTMLDivElement) => this.contentRef = elm}
        >
          {this.text}
        </div>
        {this.status === 'playing' && <div style={style}>{this.text}</div>}
      </div>
    );
  }
}
