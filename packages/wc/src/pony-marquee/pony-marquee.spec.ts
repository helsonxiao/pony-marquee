import { newSpecPage } from '@stencil/core/testing';
import { MyComponent } from './pony-marquee';

describe('pony-marquee', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: '<pony-marquee></pony-marquee>',
    });
    expect(root).toEqualHtml(`
      <pony-marquee>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </pony-marquee>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: `<pony-marquee first="Stencil" last="'Don't call me a framework' JS"></pony-marquee>`,
    });
    expect(root).toEqualHtml(`
      <pony-marquee first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </pony-marquee>
    `);
  });
});
